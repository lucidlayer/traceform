import { WebSocketServer, WebSocket } from 'ws';

const PORT = 8765; // Port used by clients

// Keep track of connected clients (browser extensions)
const clients = new Set<WebSocket>(); // Store connected browser extension clients

// Define expected message structure from VS Code extension
interface HighlightMessage {
  type: 'HIGHLIGHT_COMPONENT';
  componentName: string;
}

// Type guard to check if an object is a valid HighlightMessage
function isValidHighlightMessage(message: any): message is HighlightMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    message.type === 'HIGHLIGHT_COMPONENT' &&
    typeof message.componentName === 'string' &&
    message.componentName.length > 0
  );
}


console.log(`Attempting to start WebSocket server on port ${PORT}...`);

const wss = new WebSocketServer({ port: PORT });

wss.on('listening', () => {
  console.log(`✅ WebSocket server listening on ws://localhost:${PORT}`);
});

wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 Client connected.');
  clients.add(ws);

  // Handle messages from this client (expecting from VS Code extension)
  ws.on('message', (messageBuffer: Buffer) => {
    const messageString = messageBuffer.toString();
    console.log('➡️ Received message:', messageString);

    try {
      const parsedMessage = JSON.parse(messageString);

      if (isValidHighlightMessage(parsedMessage)) {
        // Valid command, broadcast to all connected browser clients
        console.log(`📢 Broadcasting highlight command for: ${parsedMessage.componentName}`);
        clients.forEach((client) => {
          // Check if the client connection is still open
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(messageString); // Forward the original message string
          }
        });
      } else {
        console.warn('⚠️ Received invalid or unknown message format:', parsedMessage);
        // Optional: Send an error back to the sender (VS Code) if needed
        // if (ws.readyState === WebSocket.OPEN) {
        //   ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
        // }
      }
    } catch (error) {
      console.error('❌ Failed to parse incoming message as JSON:', error);
      // Optional: Send an error back to the sender
      // if (ws.readyState === WebSocket.OPEN) {
      //    ws.send(JSON.stringify({ type: 'ERROR', message: 'Malformed JSON received' }));
      // }
    }
  });

  ws.on('close', () => {
    console.log('🔌 Client disconnected.');
    clients.delete(ws);
  });

  ws.on('error', (error: Error) => {
    console.error('WebSocket error on client connection:', error);
    clients.delete(ws); // Ensure cleanup on error
  });
});

wss.on('error', (error: Error & { code?: string }) => { // Add code property to type hint
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use. Is another instance running?`);
    // Optionally, attempt to exit gracefully or try another port if applicable
    process.exit(1); // Exit if port is taken
  } else {
    console.error('❌ WebSocket Server Error:', error);
  }
});

// Optional: Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🔌 Shutting down WebSocket server...');
  wss.close((err) => {
    if (err) {
      console.error('Error closing WebSocket server:', err);
    } else {
      console.log('WebSocket server closed.');
    }
    process.exit(err ? 1 : 0);
  });
  // Force close clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.terminate();
    }
  });
});

console.log('WebSocket server setup initiated.');
