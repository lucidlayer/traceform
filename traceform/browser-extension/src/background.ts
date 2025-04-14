const BRIDGE_SERVER_URL = 'ws://localhost:9901'; // Default bridge server URL (Updated to match server)
let socket: WebSocket | null = null;
let reconnectInterval = 1000; // Start with 1 second reconnect interval
const maxReconnectInterval = 10000; // Max 10 seconds interval

console.log('Code-to-UI Mapper: Background service worker started.');

// --- DevTools Panel Communication ---
const devtoolsPorts: chrome.runtime.Port[] = [];
let targetUrl: string | null = null;
let checkIntervalId: any = null; // Use 'any' for broader compatibility
let lastServerStatus: 'up' | 'down' | 'checking' | null = null;
const CHECK_INTERVAL = 5000; // Check every 5 seconds

function broadcastToDevtools(msg: any) {
  devtoolsPorts.forEach((port) => {
    try {
      port.postMessage(msg);
    } catch (e) {
      // Ignore errors if port is closed
    }
  });
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "traceform-panel") {
    devtoolsPorts.push(port);
    port.onDisconnect.addListener(() => {
      const idx = devtoolsPorts.indexOf(port);
      if (idx !== -1) devtoolsPorts.splice(idx, 1);
      console.log('DevTools panel disconnected.');
    });

    // Handle messages from the DevTools panel
    port.onMessage.addListener(async (msg) => { // Make listener async for storage
      console.log('Background received message from panel:', msg); // Log received messages
      if (msg.type === 'panelReady') {
        // Panel is ready, send initial status
        console.log('Panel is ready, sending initial status.');
        sendInitialStatus(port);
      } else if (msg.type === 'getStoredTargetUrl') {
        // Panel is requesting the stored URL
        console.log('Background received getStoredTargetUrl request.');
        try {
          const result = await chrome.storage.local.get(['targetUrl']);
          console.log('Read from storage:', result);
          port.postMessage({ type: 'storedTargetUrl', url: result.targetUrl || null });
        } catch (error) {
           console.error("Error getting targetUrl from storage:", error);
           port.postMessage({ type: 'storedTargetUrl', url: null }); // Send null on error
        }
      } else if (msg.type === 'setTargetUrl' && msg.url) {
        console.log(`Background received setTargetUrl: ${msg.url}`);
        targetUrl = msg.url; // Update in-memory variable
        lastServerStatus = null; // Reset status on new URL
        // Also save to storage
        try {
            await chrome.storage.local.set({ targetUrl: targetUrl });
            console.log(`Saved targetUrl to storage: ${targetUrl}`);
        } catch (error) {
            console.error("Error saving targetUrl to storage:", error);
        }
        startServerCheck(); // Start/restart the check
      } else if (msg.type === 'refreshTargetTab') {
         console.log('Background received refreshTargetTab request.');
         refreshTargetTab();
      } else if (msg.type === 'ping') {
         // Respond to keep-alive ping from panel
         // console.log('[BACKGROUND] Received ping, sending pong.'); // Optional: uncomment for debugging
         try {
            port.postMessage({ type: 'pong' });
         } catch (e) {
            console.error("Error sending pong to panel:", e);
         }
      }
      // Add other message handlers if needed
    });

    // Don't send initial status immediately, wait for panelReady
    // port.postMessage({ type: "status", status: "Panel connected" });
  }
});

// Function to send current status to a specific port
function sendInitialStatus(port: chrome.runtime.Port) {
   try {
      port.postMessage({ type: "status", status: "Panel connected" }); // Confirm connection
      if (socket && socket.readyState === WebSocket.OPEN) {
         port.postMessage({ type: "status", status: "Connected to Bridge Server" });
      } else {
         port.postMessage({ type: "status", status: "Disconnected from Bridge Server" });
      }
      if (targetUrl) {
          port.postMessage({ type: "serverStatus", status: lastServerStatus ?? 'checking', url: targetUrl });
      } else {
          port.postMessage({ type: "serverStatus", status: 'idle', url: null });
      }
   } catch (e) {
      console.error("Error sending initial status to panel:", e);
   }
}

// Function to find and reload the target tab
async function refreshTargetTab() {
  if (!targetUrl) {
    console.warn('Cannot refresh tab: No target URL set.');
    broadcastToDevtools({ type: "error", message: "Cannot refresh: No target URL set in panel." });
    return;
  }

  try {
    // Find tabs matching the target URL (ignoring trailing slash)
    const urlPattern = targetUrl.endsWith('/') ? targetUrl.slice(0, -1) : targetUrl;
    const tabs = await chrome.tabs.query({ url: `${urlPattern}*` }); // Match prefix

    if (tabs.length > 0 && tabs[0].id) {
      const tabId = tabs[0].id;
      console.log(`Found target tab ${tabId} matching ${urlPattern}*. Reloading...`);
      await chrome.tabs.reload(tabId);
      broadcastToDevtools({ type: "status", message: `Reloaded tab ${tabId} (${targetUrl})` });
    } else {
      console.warn(`No open tab found matching URL pattern: ${urlPattern}*`);
      broadcastToDevtools({ type: "error", message: `No open tab found for ${targetUrl}` });
    }
  } catch (error) {
    console.error('Error refreshing target tab:', error);
    broadcastToDevtools({ type: "error", message: `Error refreshing tab: ${error}` });
  }
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  // Handle getStoredTargetUrl
  if (msg.type === 'getStoredTargetUrl') {
    try {
      const result = await chrome.storage.local.get(['targetUrl']);
      sendResponse({ url: result.targetUrl || null });
    } catch (error) {
      sendResponse({ url: null, error: error?.toString() });
    }
    return true; // Indicates async response
  }
  // Handle setTargetUrl
  if (msg.type === 'setTargetUrl' && msg.url) {
    try {
      targetUrl = msg.url;
      lastServerStatus = null;
      await chrome.storage.local.set({ targetUrl: targetUrl });
      startServerCheck();
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error?.toString() });
    }
    return true;
  }
  // Handle refreshTargetTab
  if (msg.type === 'refreshTargetTab') {
    try {
      await refreshTargetTab();
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error?.toString() });
    }
    return true;
  }
  // Handle keepAlive/ping (optional, for completeness)
  if (msg.type === 'ping') {
    sendResponse({ type: 'pong' });
    return true;
  }
  // Unknown message
  sendResponse({ error: 'Unknown message type' });
  return true;
});

// --- Dev Server Status Check ---
async function checkServerStatus() {
  if (!targetUrl) return;

  let currentStatus: 'up' | 'down' = 'down'; // Assume down unless proven otherwise
  try {
    // Use fetch with HEAD request and AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHECK_INTERVAL - 500); // Timeout slightly less than interval

    const response = await fetch(targetUrl, { method: 'HEAD', signal: controller.signal, mode: 'no-cors' }); // no-cors might be needed for simple checks
    clearTimeout(timeoutId);

    // Note: 'no-cors' responses have status 0, but success means server is reachable
    // A more robust check might involve a specific health endpoint if available.
    // For now, any successful fetch (even opaque) implies 'up'.
    currentStatus = 'up';

  } catch (error: any) {
     // Network errors typically mean the server is down or unreachable
     if (error.name === 'AbortError') {
        console.warn(`Server check for ${targetUrl} timed out.`);
     }
     currentStatus = 'down';
  }

  if (currentStatus !== lastServerStatus) {
    console.log(`Server status changed for ${targetUrl}: ${currentStatus}`);
    lastServerStatus = currentStatus;
    broadcastToDevtools({ type: "serverStatus", status: currentStatus, url: targetUrl });
  }
}

function startServerCheck() {
  // Clear existing interval if any
  if (checkIntervalId !== null) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
    console.log('Stopped previous server check interval.');
  }

  if (targetUrl) {
    console.log(`Starting server check interval for ${targetUrl} every ${CHECK_INTERVAL / 1000}s`);
    // Perform an initial check immediately
    checkServerStatus();
    // Set up the interval
    checkIntervalId = setInterval(checkServerStatus, CHECK_INTERVAL);
  } else {
     console.log('No target URL set, server check not started.');
     lastServerStatus = null;
     broadcastToDevtools({ type: "serverStatus", status: "idle", url: null }); // Notify panel it's idle
  }
}

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
    broadcastToDevtools({ type: "status", status: "Connected to Bridge Server" });
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
                if (errorMessage.includes('Receiving end does not exist')) {
                  // Specific error message for missing content script
                  const warnMsg = `Content script not found on tab ${tabId}. If the page was recently reloaded or the dev server restarted, try refreshing the page.`;
                  console.warn(warnMsg);
                  broadcastToDevtools({ type: "error", message: warnMsg });
                } else if (!errorMessage.includes('the message channel closed before a response was received')) {
                   // Log other potential errors, ignoring the benign "channel closed" error
                   console.error(
                     `Error sending message to content script (tab ${tabId}, attempt ${attempt}):`,
                     errorMessage
                   );
                }
                // Note: Retry logic could be added here if desired.
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
    broadcastToDevtools({ type: "status", status: "Disconnected from Bridge Server" });

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
