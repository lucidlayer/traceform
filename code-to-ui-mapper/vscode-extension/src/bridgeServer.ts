import { WebSocketServer, WebSocket } from 'ws';
import * as vscode from 'vscode';
import * as net from 'net'; // Import Node.js net module for port checking
import { EventEmitter } from 'events';

// Define a type for our logger to allow console or OutputChannel
type Logger = Pick<vscode.OutputChannel, 'appendLine'>;

const MAX_LOG_BUFFER_SIZE = 200; // Store the last 200 log entries
const logBuffer: string[] = [];
const logEmitter = new EventEmitter(); // Emitter for log messages

// Define possible server statuses
export type ServerStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'error' | 'port-conflict';

// Define the payload for status updates
export type StatusUpdatePayload = {
  status: ServerStatus;
  port?: number; // Include port only when relevant (e.g., running)
};

const PORT = 9901; // Port for the integrated bridge server
let wss: WebSocketServer | null = null;
let currentStatus: ServerStatus = 'stopped'; // Track current status
const statusEmitter = new EventEmitter(); // Emitter for status changes

// Internal log function
function log(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${message}`;

  // Add to buffer and trim if necessary
  logBuffer.push(logEntry);
  if (logBuffer.length > MAX_LOG_BUFFER_SIZE) {
    logBuffer.shift(); // Remove the oldest entry
  }

  // Emit event for sidebar
  logEmitter.emit('newLog', logEntry);

  // Also log to the original output channel
  logger.appendLine(logEntry);
}

// Function to update status and emit event
function updateStatus(newStatus: ServerStatus) {
  if (currentStatus !== newStatus) {
    currentStatus = newStatus;
    const payload: StatusUpdatePayload = { status: newStatus };
    if (newStatus === 'running') {
      payload.port = PORT; // Include port when running
    }
    statusEmitter.emit('statusChange', payload); // Emit the payload object
    log(`[Status] Changed to: ${currentStatus}${newStatus === 'running' ? ` on port ${PORT}` : ''}`); // Log port too
  }
}

// Export getter for logs and emitter for listeners
export function getLogs(): string[] {
  return [...logBuffer]; // Return a copy
}
export const bridgeServerLogEmitter = logEmitter;

// Export getter for status and emitter for listeners
export function getServerStatus(): ServerStatus {
  return currentStatus;
}
export const bridgeServerStatusEmitter = statusEmitter;


// Default logger uses console.log if no OutputChannel is provided
let logger: Logger = { appendLine: (value: string) => console.log(value) }; // This remains for the initial setup before startBridgeServer provides the real one
const clients = new Set<WebSocket>(); // Store connected browser extension clients

// Define expected message structure (can be shared or redefined)
interface HighlightMessage {
  type: 'HIGHLIGHT_COMPONENT';
  componentName: string;
}

// Type guard
function isValidHighlightMessage(message: any): message is HighlightMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    message.type === 'HIGHLIGHT_COMPONENT' &&
    typeof message.componentName === 'string' &&
    message.componentName.length > 0
  );
}

// Helper function to check if a port is in use
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is definitely in use
      } else {
        reject(err); // Other error
      }
    });
    server.once('listening', () => {
      server.close(() => {
        resolve(false); // Port was free
      });
    });
    server.listen(port);
  });
}

// Helper function to PING an existing server on the port
function checkExistingServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const tempWs = new WebSocket(`ws://localhost:${PORT}`);
    let pongReceived = false;

    const timeout = setTimeout(() => {
      log(`[PING Check] Timeout waiting for PONG from existing server on port ${PORT}.`); // Use log
      tempWs.terminate(); // Close the connection attempt
      resolve(false); // Assume not responsive or not our server
    }, 2000); // 2-second timeout for the check

    tempWs.on('open', () => {
      log(`[PING Check] Connection opened to existing server on port ${PORT}. Sending PING.`); // Use log
      tempWs.send(JSON.stringify({ type: 'PING' }));
    });

    tempWs.on('message', (messageBuffer: Buffer) => {
      try {
        const message = JSON.parse(messageBuffer.toString());
        if (message.type === 'PONG') {
          log(`[PING Check] Received PONG from existing server.`); // Use log
          pongReceived = true;
          clearTimeout(timeout);
          tempWs.close();
          resolve(true); // It's our responsive server
        }
      } catch (e) {
        // Ignore parse errors for this check
      }
    });

    tempWs.on('error', (err) => {
      log(`[PING Check] Error connecting or communicating with existing server on port ${PORT}: ${err.message}`); // Use log
      clearTimeout(timeout);
      resolve(false); // Assume not responsive or not our server
    });

    tempWs.on('close', () => {
      clearTimeout(timeout);
      if (!pongReceived) {
        // Closed without receiving PONG (or after timeout)
        log(`[PING Check] Connection to existing server closed without receiving PONG.`); // Use log
        resolve(false);
      }
      // If pongReceived is true, the promise was already resolved
    });
  });
}


// Accept the output channel as an argument
export async function startBridgeServer(outputChannel: Logger): Promise<void> { // Make function async
  if (currentStatus === 'starting' || currentStatus === 'running') {
    log('[Server] Start requested but already starting or running.'); // Use log
    return Promise.resolve(); // Or maybe reject? For now, resolve.
  }
  logger = outputChannel; // Use the provided channel for logging FIRST
  updateStatus('starting'); // Then update status (which uses log)

  // --- Proactive Port Check & Ping ---
  try {
    const portBusy = await isPortInUse(PORT);
    if (portBusy) {
      log(`⚠️ Port ${PORT} is already in use. Checking if it's a responsive bridge server...`); // Use log
      try {
        const isExistingServerResponsive = await checkExistingServer();
        if (isExistingServerResponsive) {
          log(`✅ Existing bridge server on port ${PORT} is responsive. Not starting a new one.`); // Use log
          // Assuming the existing server is running correctly
          updateStatus('running'); // Update status to running as we are using the existing one
          return Promise.resolve();
        } else {
           // Existing server is not responsive or not ours
           const errorMsg = `Port ${PORT} is in use but the process is not a responsive bridge server.`;
           log(`❌ ${errorMsg}`); // Use log
           vscode.window.showErrorMessage(errorMsg + ' Please close the conflicting application.');
           updateStatus('port-conflict'); // Set status
           throw new Error(errorMsg);
        }
      } catch (pingError) {
         // Error during the ping check itself
         const errorMsg = `Port ${PORT} is in use, and failed to verify the existing process: ${pingError instanceof Error ? pingError.message : String(pingError)}`;
         log(`❌ ${errorMsg}`); // Use log
         vscode.window.showErrorMessage(errorMsg + ' Please close the conflicting application.');
         updateStatus('error'); // Set status
         throw new Error(errorMsg);
      }
    } else {
       log(`✅ Port ${PORT} is available.`); // Use log
    }
  } catch (err) {
     // Catch errors from isPortInUse or the ping check block
     const errorMsg = `Error during port check/ping for port ${PORT}: ${err instanceof Error ? err.message : String(err)}`;
     log(`❌ ${errorMsg}`); // Use log
     // Don't show vscode error message again if it was already shown
     if (!(err instanceof Error && err.message.includes(`Port ${PORT} is in use`))) {
        vscode.window.showErrorMessage(errorMsg);
     }
     // Ensure status reflects the failure if it wasn't already set
     if (currentStatus !== 'port-conflict' && currentStatus !== 'error') {
        updateStatus('error');
     }
     throw err; // Rethrow to reject the promise
  }
  // --- End Port Check ---


  // Proceed with server startup only if port check passed and no existing responsive server found
  return new Promise((resolve, reject) => { // Keep the promise for the actual server start
    // Double check state, although start should prevent re-entry if running/starting
    if (wss || currentStatus === 'running') {
      log('[Server] Already running (unexpected state before creating new server).'); // Use log
      updateStatus('running'); // Ensure status is correct
      resolve();
      return;
    }

    log(`Attempting to start WebSocket server on port ${PORT}...`); // Use log
    try {
      wss = new WebSocketServer({ port: PORT });

      wss.on('listening', () => {
        log(`✅ WebSocket server listening on ws://localhost:${PORT}`); // Use log
        updateStatus('running'); // Update status on successful listen
        resolve();
      });

      wss.on('connection', (ws: WebSocket) => {
        log('🔌 Client connected.'); // Use log
        clients.add(ws);

        // Handle messages (expecting from this extension's client.ts)
        ws.on('message', (messageBuffer: Buffer) => {
          const messageString = messageBuffer.toString();
          log(`➡️ Received message: ${messageString}`); // Use log

          try {
            const parsedMessage = JSON.parse(messageString);

            if (isValidHighlightMessage(parsedMessage)) {
              // Valid command, broadcast to all *other* connected clients (browsers)
              log(`📢 Broadcasting highlight command for: ${parsedMessage.componentName}`); // Use log
              clients.forEach((client) => {
                // Don't send back to the sender (which is the VS Code client itself)
                // Also check if the client connection is still open
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(messageString);
                }
              });
            } else if (parsedMessage.type === 'PING') {
              // Respond to PING messages immediately
              ws.send(JSON.stringify({ type: 'PONG' }));
              log('🏓 Responded to PING with PONG.'); // Use log
            } else {
              log(`⚠️ Received invalid or unknown message format: ${JSON.stringify(parsedMessage)}`); // Use log
            }
          } catch (error) {
             const errorMessage = error instanceof Error ? error.message : String(error);
            log(`❌ Failed to parse incoming message as JSON: ${errorMessage}`); // Use log
          }
        });

        ws.on('close', () => {
          log('🔌 Client disconnected.'); // Use log
          clients.delete(ws);
        });

        ws.on('error', (error: Error) => {
          log(`WebSocket error on client connection: ${error.message}`); // Use log
          clients.delete(ws); // Remove client on error too
        });
      });

      wss.on('error', (error: Error & { code?: string }) => {
        const errorMessage = `❌ WebSocket Server Error: ${error.message}`;
        log(errorMessage); // Use log
        if (error.code === 'EADDRINUSE') {
           // This specific error is handled by the proactive check now, but keep for safety
           updateStatus('port-conflict');
           vscode.window.showErrorMessage(`Port ${PORT} is already in use. Please close the other process or change the port.`);
        } else {
           updateStatus('error');
           vscode.window.showErrorMessage(`Bridge Server Error: ${error.message}`);
        }
        wss = null; // Ensure we know the server isn't running
        reject(error); // Reject the promise
        // No need to call stopBridgeServer here, as wss is already nullified
      });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(`❌ Failed to initialize WebSocketServer: ${errorMessage}`); // Use log
        vscode.window.showErrorMessage(`Failed to start Bridge Server: ${errorMessage}`);
        updateStatus('error');
        wss = null;
        reject(error);
    }
  });
}

// Accept the output channel as an argument
export function stopBridgeServer(outputChannel: Logger): Promise<void> {
  if (currentStatus === 'stopped' || currentStatus === 'stopping') {
     log('[Server] Stop requested but already stopping or stopped.'); // Use log
     return Promise.resolve();
  }
  logger = outputChannel; // Use the provided channel FIRST
  updateStatus('stopping'); // Then update status (which uses log)

  return new Promise((resolve) => {
    if (wss) {
      log('\n🔌 Shutting down WebSocket server...'); // Use log
      // Close client connections first
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.terminate(); // Force close
        }
      });
      clients.clear();

      wss.close((err) => {
        if (err) {
          log(`Error closing WebSocket server: ${err.message}`); // Use log
           updateStatus('error'); // Update status if closing failed
        } else {
          log('WebSocket server closed.'); // Use log
           updateStatus('stopped'); // Update status on successful close
        }
        wss = null;
        resolve();
      });
    } else {
      log('[Server] Not running.'); // Use log
      updateStatus('stopped'); // Ensure status is stopped if wss was already null
      resolve();
    }
  });
}
