const BRIDGE_SERVER_URL = 'ws://localhost:9901'; // Default bridge server URL (Updated to match server)
let socket: WebSocket | null = null;
let reconnectInterval = 5000; // Start with 5 seconds reconnect interval
const maxReconnectInterval = 60000; // Max 1 minute interval

console.log('Code-to-UI Mapper: Background service worker started.');

function connectWebSocket() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    console.log('WebSocket already open or connecting.');
    return;
  }

  console.log(`Attempting to connect to WebSocket: ${BRIDGE_SERVER_URL}`);
  socket = new WebSocket(BRIDGE_SERVER_URL);

  socket.onopen = () => {
    console.log('WebSocket connection established.');
    // Reset reconnect interval on successful connection
    reconnectInterval = 5000;
    // Optional: Update extension icon or title to show active connection
    chrome.action.setTitle({ title: 'Code-to-UI Mapper (Connected)' });
    // chrome.action.setIcon({ path: "images/icon_active16.png" }); // If you have active icons
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    try {
      const message = JSON.parse(event.data);

      // Basic validation
      if (!message || !message.type || !message.componentName) {
         console.error('Invalid message format received from WebSocket:', message);
         return;
      }

      // Relay message to active tab's content script
      // Find active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0 && tabs[0].id) {
          const activeTabId = tabs[0].id;
          console.log(`Relaying message to tab ID: ${activeTabId}`, message);
          chrome.tabs.sendMessage(activeTabId, message, (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                'Error sending message to content script:',
                chrome.runtime.lastError.message
              );
            } else {
              console.log('Content script responded:', response);
            }
          });
        } else {
          console.error('Could not find active tab to send message to.');
        }
      });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Note: onclose will usually be called after onerror
  };

  socket.onclose = (event) => {
    console.log(
      `WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}. Attempting reconnect in ${reconnectInterval / 1000}s.`
    );
    socket = null; // Clear the socket reference
    // Optional: Update icon/title to inactive state
     chrome.action.setTitle({ title: 'Code-to-UI Mapper (Disconnected)' });
    // chrome.action.setIcon({ path: "images/icon16.png" });

    // Attempt to reconnect with exponential backoff
    setTimeout(connectWebSocket, reconnectInterval);
    // Increase interval for next time, up to max
    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
  };
}

// Initial connection attempt
connectWebSocket();

// Optional: Listen for extension startup or installation to connect
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension startup: attempting WebSocket connection.');
  connectWebSocket();
});

chrome.runtime.onInstalled.addListener(() => {
   console.log('Extension installed/updated: attempting WebSocket connection.');
   connectWebSocket();
});

// Keep service worker alive logic (if needed, less common in MV3 with events)
// chrome.runtime.onMessage.addListener(...); // Keep alive if messages are frequent
