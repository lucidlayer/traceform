import { WebSocketServer, WebSocket } from 'ws';
import * as vscode from 'vscode';
import * as net from 'net'; // Import Node.js net module for port checking
import { EventEmitter } from 'events'; // Import EventEmitter

// Define a type for our logger to allow console or OutputChannel
type Logger = Pick<vscode.OutputChannel, 'appendLine'>;

// Define possible server statuses
export type ServerStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'error' | 'port-conflict';

const PORT = 9901; // Port for the integrated bridge server
let wss: WebSocketServer | null = null;
let currentStatus: ServerStatus = 'stopped'; // Track current status
const statusEmitter = new EventEmitter(); // Emitter for status changes

// Function to update status and emit event
function updateStatus(newStatus: ServerStatus) {
  if (currentStatus !== newStatus) {
    currentStatus = newStatus;
    statusEmitter.emit('statusChange', currentStatus);
    logger.appendLine(`[Bridge Server Status] Changed to: ${currentStatus}`);
  }
}

// Export getter for status and emitter for listeners
export function getServerStatus(): ServerStatus {
  return currentStatus;
}
export const bridgeServerStatusEmitter = statusEmitter;


// Default logger uses console.log if no OutputChannel is provided
let logger: Logger = { appendLine: (value: string) => console.log(value) };
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
      logger.appendLine(`[PING Check] Timeout waiting for PONG from existing server on port ${PORT}.`);
      tempWs.terminate(); // Close the connection attempt
      resolve(false); // Assume not responsive or not our server
    }, 2000); // 2-second timeout for the check

    tempWs.on('open', () => {
      logger.appendLine(`[PING Check] Connection opened to existing server on port ${PORT}. Sending PING.`);
      tempWs.send(JSON.stringify({ type: 'PING' }));
    });

    tempWs.on('message', (messageBuffer: Buffer) => {
      try {
        const message = JSON.parse(messageBuffer.toString());
        if (message.type === 'PONG') {
          logger.appendLine(`[PING Check] Received PONG from existing server.`);
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
      logger.appendLine(`[PING Check] Error connecting or communicating with existing server on port ${PORT}: ${err.message}`);
      clearTimeout(timeout);
      resolve(false); // Assume not responsive or not our server
    });

    tempWs.on('close', () => {
      clearTimeout(timeout);
      if (!pongReceived) {
        // Closed without receiving PONG (or after timeout)
        logger.appendLine(`[PING Check] Connection to existing server closed without receiving PONG.`);
        resolve(false);
      }
      // If pongReceived is true, the promise was already resolved
    });
  });
}


// Accept the output channel as an argument
export async function startBridgeServer(outputChannel: Logger): Promise<void> { // Make function async
  if (currentStatus === 'starting' || currentStatus === 'running') {
    logger.appendLine('[Bridge Server] Start requested but already starting or running.');
    return Promise.resolve(); // Or maybe reject? For now, resolve.
  }
  updateStatus('starting');
  logger = outputChannel; // Use the provided channel for logging

  // --- Proactive Port Check & Ping ---
  try {
    const portBusy = await isPortInUse(PORT);
    if (portBusy) {
      logger.appendLine(`⚠️ Port ${PORT} is already in use. Checking if it's a responsive bridge server...`);
      try {
        const isExistingServerResponsive = await checkExistingServer();
        if (isExistingServerResponsive) {
          logger.appendLine(`✅ Existing bridge server on port ${PORT} is responsive. Not starting a new one.`);
          // Assuming the existing server is running correctly
          updateStatus('running'); // Update status to running as we are using the existing one
          return Promise.resolve();
        } else {
           // Existing server is not responsive or not ours
           const errorMsg = `Port ${PORT} is in use but the process is not a responsive bridge server.`;
           logger.appendLine(`❌ ${errorMsg}`);
           vscode.window.showErrorMessage(errorMsg + ' Please close the conflicting application.');
           updateStatus('port-conflict'); // Set status
           throw new Error(errorMsg);
        }
      } catch (pingError) {
         // Error during the ping check itself
         const errorMsg = `Port ${PORT} is in use, and failed to verify the existing process: ${pingError instanceof Error ? pingError.message : String(pingError)}`;
         logger.appendLine(`❌ ${errorMsg}`);
         vscode.window.showErrorMessage(errorMsg + ' Please close the conflicting application.');
         updateStatus('error'); // Set status
         throw new Error(errorMsg);
      }
    } else {
       logger.appendLine(`✅ Port ${PORT} is available.`);
    }
  } catch (err) {
     // Catch errors from isPortInUse or the ping check block
     const errorMsg = `Error during port check/ping for port ${PORT}: ${err instanceof Error ? err.message : String(err)}`;
     logger.appendLine(`❌ ${errorMsg}`);
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
      logger.appendLine('Bridge server already running (unexpected state before creating new server).');
      updateStatus('running'); // Ensure status is correct
      resolve();
      return;
    }

    logger.appendLine(`Attempting to start integrated WebSocket server on port ${PORT}...`);
    try {
      wss = new WebSocketServer({ port: PORT });

      wss.on('listening', () => {
        logger.appendLine(`✅ Integrated WebSocket server listening on ws://localhost:${PORT}`);
        updateStatus('running'); // Update status on successful listen
        resolve();
      });

      wss.on('connection', (ws: WebSocket) => {
        logger.appendLine('🔌 [Integrated Server] Client connected.');
        clients.add(ws);

        // Handle messages (expecting from this extension's client.ts)
        ws.on('message', (messageBuffer: Buffer) => {
          const messageString = messageBuffer.toString();
          logger.appendLine(`➡️ [Integrated Server] Received message: ${messageString}`); // Log full string

          try {
            const parsedMessage = JSON.parse(messageString);

            if (isValidHighlightMessage(parsedMessage)) {
              // Valid command, broadcast to all *other* connected clients (browsers)
              logger.appendLine(`📢 [Integrated Server] Broadcasting highlight command for: ${parsedMessage.componentName}`);
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
              logger.appendLine('🏓 [Integrated Server] Responded to PING with PONG.');
            } else {
              logger.appendLine(`⚠️ [Integrated Server] Received invalid or unknown message format: ${JSON.stringify(parsedMessage)}`);
            }
          } catch (error) {
             const errorMessage = error instanceof Error ? error.message : String(error);
            logger.appendLine(`❌ [Integrated Server] Failed to parse incoming message as JSON: ${errorMessage}`);
          }
        });

        ws.on('close', () => {
          logger.appendLine('🔌 [Integrated Server] Client disconnected.');
          clients.delete(ws);
        });

        ws.on('error', (error: Error) => {
          logger.appendLine(`[Integrated Server] WebSocket error on client connection: ${error.message}`);
          clients.delete(ws); // Remove client on error too
        });
      });

      wss.on('error', (error: Error & { code?: string }) => {
        const errorMessage = `❌ [Integrated Server] WebSocket Server Error: ${error.message}`;
        logger.appendLine(errorMessage);
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
        logger.appendLine(`❌ Failed to initialize WebSocketServer: ${errorMessage}`);
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
     logger.appendLine('[Bridge Server] Stop requested but already stopping or stopped.');
     return Promise.resolve();
  }
  updateStatus('stopping');
  logger = outputChannel; // Use the provided channel

  return new Promise((resolve) => {
    if (wss) {
      logger.appendLine('\n🔌 Shutting down integrated WebSocket server...');
      // Close client connections first
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.terminate(); // Force close
        }
      });
      clients.clear();

      wss.close((err) => {
        if (err) {
          logger.appendLine(`[Integrated Server] Error closing WebSocket server: ${err.message}`);
           updateStatus('error'); // Update status if closing failed
        } else {
          logger.appendLine('[Integrated Server] WebSocket server closed.');
           updateStatus('stopped'); // Update status on successful close
        }
        wss = null;
        resolve();
      });
    } else {
      logger.appendLine('[Integrated Server] Server not running.');
      updateStatus('stopped'); // Ensure status is stopped if wss was already null
      resolve();
    }
  });
}
