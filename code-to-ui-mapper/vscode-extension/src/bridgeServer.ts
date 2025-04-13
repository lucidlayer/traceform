import { WebSocketServer, WebSocket } from 'ws';
import * as vscode from 'vscode';

// Define a type for our logger to allow console or OutputChannel
type Logger = Pick<vscode.OutputChannel, 'appendLine'>;

const PORT = 9901; // Port for the integrated bridge server
let wss: WebSocketServer | null = null;
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

// Accept the output channel as an argument
export function startBridgeServer(outputChannel: Logger): Promise<void> {
  logger = outputChannel; // Use the provided channel for logging
  return new Promise((resolve, reject) => {
    if (wss) {
      logger.appendLine('Bridge server already running.');
      resolve();
      return;
    }

    logger.appendLine(`Attempting to start integrated WebSocket server on port ${PORT}...`);
    try {
      wss = new WebSocketServer({ port: PORT });

      wss.on('listening', () => {
        logger.appendLine(`✅ Integrated WebSocket server listening on ws://localhost:${PORT}`);
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
          clients.delete(ws);
        });
      });

      wss.on('error', (error: Error & { code?: string }) => {
        const errorMessage = `❌ [Integrated Server] WebSocket Server Error: ${error.message}`;
        logger.appendLine(errorMessage);
        if (error.code === 'EADDRINUSE') {
          vscode.window.showErrorMessage(`Port ${PORT} is already in use. Please close the other process or change the port.`);
          // Do not automatically exit, let the user handle it.
          wss = null; // Ensure we know the server isn't running
          reject(error); // Reject the promise
        } else {
           vscode.window.showErrorMessage(`Bridge Server Error: ${error.message}`);
           reject(error);
        }
         stopBridgeServer(logger); // Attempt cleanup, pass logger
      });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.appendLine(`❌ Failed to initialize WebSocketServer: ${errorMessage}`);
        vscode.window.showErrorMessage(`Failed to start Bridge Server: ${errorMessage}`);
        wss = null;
        reject(error);
    }
  });
}

// Accept the output channel as an argument
export function stopBridgeServer(outputChannel: Logger): Promise<void> {
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
        } else {
          logger.appendLine('[Integrated Server] WebSocket server closed.');
        }
        wss = null;
        resolve();
      });
    } else {
      logger.appendLine('[Integrated Server] Server not running.');
      resolve();
    }
  });
}
