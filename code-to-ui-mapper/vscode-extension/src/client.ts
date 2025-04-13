import WebSocket from 'ws';
import * as vscode from 'vscode';
import { stopBridgeServer } from './bridgeServer'; // Import server stop function

const BRIDGE_SERVER_URL = 'ws://localhost:9901'; // Must match bridge server (Updated)
let socket: WebSocket | null = null;
let reconnectInterval = 5000;
const maxReconnectInterval = 60000;
let connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
let statusItem: vscode.StatusBarItem | null = null;

function updateStatus(text: string, tooltip?: string) {
  if (!statusItem) {
    statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusItem.show();
  }
  statusItem.text = `$(plug) CodeUI: ${text}`;
  statusItem.tooltip = tooltip || `Code-to-UI Mapper Status: ${text}`;
}

export function connectWebSocketClient() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    console.log('WebSocket client already open or connecting.');
    return;
  }

  console.log(`Attempting WebSocket connection to bridge: ${BRIDGE_SERVER_URL}`);
  updateStatus('Connecting...');
  connectionStatus = 'connecting';
  socket = new WebSocket(BRIDGE_SERVER_URL);

  socket.on('open', () => {
    console.log('WebSocket client connection established.');
    connectionStatus = 'connected';
    updateStatus('Connected', `Connected to ${BRIDGE_SERVER_URL}`);
    reconnectInterval = 5000; // Reset interval on success
  });

  socket.on('message', (data) => {
    // VS Code extension primarily sends, doesn't expect messages back currently
    console.log('WebSocket client received message (unexpected):', data.toString());
  });

  socket.on('error', (error) => {
    console.error('WebSocket client error:', error.message);
    // onclose will be called next
    if (connectionStatus !== 'disconnected') {
       updateStatus('Error', `WebSocket Error: ${error.message}`);
    }
     connectionStatus = 'disconnected'; // Ensure status is updated even if close doesn't fire immediately
  });

  socket.on('close', (code, reason) => {
    console.log(
      `WebSocket client connection closed. Code: ${code}, Reason: ${reason?.toString()}. Reconnecting in ${reconnectInterval / 1000}s.`
    );
    socket = null;
    if (connectionStatus !== 'disconnected') { // Avoid duplicate messages if error occurred first
        updateStatus('Disconnected', `WebSocket closed. Retrying...`);
    }
    connectionStatus = 'disconnected';

    // Attempt to reconnect
    setTimeout(connectWebSocketClient, reconnectInterval);
    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
  });
}

export function sendHighlightCommand(componentName: string): boolean {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const message = JSON.stringify({
      type: 'HIGHLIGHT_COMPONENT',
      componentName: componentName,
    });
    console.log('Sending WebSocket message:', message);
    socket.send(message);
    return true;
  } else {
    console.warn(`WebSocket client cannot send command. Status: ${connectionStatus}, ReadyState: ${socket?.readyState}`);
    if (connectionStatus === 'connecting') {
      vscode.window.showWarningMessage('Code-to-UI Mapper is still connecting, please wait a moment and try again.');
    } else { // disconnected or error state
      vscode.window.showWarningMessage('Code-to-UI Mapper bridge not connected. Attempting to reconnect...');
      // Trigger a connection attempt if disconnected
      connectWebSocketClient();
    }
    return false;
  }
}

export function disconnectWebSocketClient() {
  if (socket) {
    console.log('Closing WebSocket client connection.');
    // Prevent automatic reconnection attempts by removing the close listener temporarily
    socket.removeAllListeners('close');
    socket.close();
    socket = null;
  }
  if (statusItem) {
      statusItem.dispose();
      statusItem = null;
  }
  connectionStatus = 'disconnected';
  // We don't stop the server here directly, as deactivate in extension.ts handles it.
  // However, if this client were the *only* reason the server runs, we might call stopBridgeServer() here.
}

// Initialize status bar item on load
export function initializeClient(context: vscode.ExtensionContext) {
    updateStatus('Disconnected');
    context.subscriptions.push({ dispose: disconnectWebSocketClient }); // Ensure cleanup on deactivate
}
