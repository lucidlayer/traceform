const BRIDGE_SERVER_URL = 'ws://localhost:9901'; // Default bridge server URL (Updated to match server)
let socket: WebSocket | null = null;
let reconnectInterval = 1000; // Start with 1 second reconnect interval
const maxReconnectInterval = 10000; // Max 10 seconds interval

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
    reconnectInterval = 1000; // Reset to the new initial interval
    // Optional: Update extension icon or title to show active connection
    chrome.action.setTitle({ title: 'Code-to-UI Mapper (Connected)' });
    // chrome.action.setIcon({ path: "images/icon_active16.png" }); // If you have active icons
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    try {
      const message = JSON.parse(event.data);

      // Basic validation - Expect traceformId now
      if (!message || !message.type || (message.type === 'HIGHLIGHT_COMPONENT' && !message.traceformId)) {
         console.error('Invalid message format received from WebSocket (expected traceformId for HIGHLIGHT_COMPONENT):', message);
         return;
      }

      // Relay message to active tab's content script
      // Find active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0 && tabs[0].id) {
          const activeTabId = tabs[0].id;
          console.log(`Relaying message to tab ID: ${activeTabId}`, message);

          // Function to send message with retry logic
          const sendMessageWithRetry = (tabId: number, msg: any, attempt = 1) => {
            const maxAttempts = 5;
            const delay = 100 * Math.pow(2, attempt - 1); // Exponential backoff: 100ms, 200ms, 400ms...

            // Send message *with* a callback, but handle the specific "channel closed" error
            chrome.tabs.sendMessage(tabId, msg, (response) => {
              if (chrome.runtime.lastError) {
                const errorMessage = chrome.runtime.lastError.message ?? 'Unknown error';
                // Ignore the specific error caused by content script returning true but not sending a response
                if (!errorMessage.includes('the message channel closed before a response was received')) {
                   // Log other potential errors
                   console.error(
                     `Error sending message to content script (tab ${tabId}, attempt ${attempt}):`,
                     errorMessage
                   );
                }
                // Note: We could potentially re-introduce retry logic here specifically for
                // 'Receiving end does not exist' if needed, but let's keep it simple first.
              } else {
                 // We don't actually expect a response, but log if one comes back
                 if (response) {
                    console.log(`Content script (tab ${tabId}) unexpectedly responded:`, response);
                 }
              }
            });
          };

          // Initial attempt to send
          sendMessageWithRetry(activeTabId, message);

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
