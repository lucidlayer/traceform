// Placeholder for bridge server logic integrated into VS Code extension
// We will adapt the code from local-bridge-server/src/index.ts here.

import { WebSocketServer, WebSocket } from 'ws';
import * as vscode from 'vscode';

const PORT = 9901; // Port for the integrated bridge server
let wss: WebSocketServer | null = null;
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

export function startBridgeServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (wss) {
      console.log('Bridge server already running.');
      resolve();
      return;
    }

    console.log(`Attempting to start integrated WebSocket server on port ${PORT}...`);
    try {
      wss = new WebSocketServer({ port: PORT });

      wss.on('listening', () => {
        console.log(`✅ Integrated WebSocket server listening on ws://localhost:${PORT}`);
        resolve();
      });

      wss.on('connection', (ws: WebSocket) => {
        console.log('🔌 [Integrated Server] Client connected.');
        clients.add(ws);

        // Handle messages (expecting from this extension's client.ts)
        ws.on('message', (messageBuffer: Buffer) => {
          const messageString = messageBuffer.toString();
          console.log('➡️ [Integrated Server] Received message:', messageString);

          try {
            const parsedMessage = JSON.parse(messageString);

            if (isValidHighlightMessage(parsedMessage)) {
              // Valid command, broadcast to all *other* connected clients (browsers)
              console.log(`📢 [Integrated Server] Broadcasting highlight command for: ${parsedMessage.componentName}`);
              clients.forEach((client) => {
                // Don't send back to the sender (which is the VS Code client itself)
                // Also check if the client connection is still open
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(messageString);
                }
              });
            } else {
              console.warn('⚠️ [Integrated Server] Received invalid or unknown message format:', parsedMessage);
            }
          } catch (error) {
            console.error('❌ [Integrated Server] Failed to parse incoming message as JSON:', error);
          }
        });

        ws.on('close', () => {
          console.log('🔌 [Integrated Server] Client disconnected.');
          clients.delete(ws);
        });

        ws.on('error', (error: Error) => {
          console.error('[Integrated Server] WebSocket error on client connection:', error);
          clients.delete(ws);
        });
      });

      wss.on('error', (error: Error & { code?: string }) => {
        console.error('❌ [Integrated Server] WebSocket Server Error:', error);
        if (error.code === 'EADDRINUSE') {
          vscode.window.showErrorMessage(`Port ${PORT} is already in use. Please close the other process or change the port.`);
          // Do not automatically exit, let the user handle it.
          wss = null; // Ensure we know the server isn't running
          reject(error); // Reject the promise
        } else {
           vscode.window.showErrorMessage(`Bridge Server Error: ${error.message}`);
           reject(error);
        }
         stopBridgeServer(); // Attempt cleanup
      });

    } catch (error) {
        console.error('❌ Failed to initialize WebSocketServer:', error);
        vscode.window.showErrorMessage(`Failed to start Bridge Server: ${error instanceof Error ? error.message : String(error)}`);
        wss = null;
        reject(error);
    }
  });
}

export function stopBridgeServer(): Promise<void> {
  return new Promise((resolve) => {
    if (wss) {
      console.log('\n🔌 Shutting down integrated WebSocket server...');
      // Close client connections first
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.terminate(); // Force close
        }
      });
      clients.clear();

      wss.close((err) => {
        if (err) {
          console.error('[Integrated Server] Error closing WebSocket server:', err);
        } else {
          console.log('[Integrated Server] WebSocket server closed.');
        }
        wss = null;
        resolve();
      });
    } else {
      console.log('[Integrated Server] Server not running.');
      resolve();
    }
  });
}
