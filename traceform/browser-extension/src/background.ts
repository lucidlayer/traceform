const BRIDGE_SERVER_URL = 'ws://localhost:9901'; // Default bridge server URL (Updated to match server)
let socket: WebSocket | null = null;
let reconnectInterval = 1000; // Start with 1 second reconnect interval
const maxReconnectInterval = 10000; // Max 10 seconds interval

console.log('Code-to-UI Mapper: Background service worker started.');

let targetUrl: string | null = null;
let checkIntervalId: any = null;
let lastServerStatus: 'up' | 'down' | 'checking' | 'idle' | null = 'idle'; // Include idle state
const CHECK_INTERVAL = 5000; // Check every 5 seconds

// --- DevTools Panel Communication ---
const panelPorts = new Set<chrome.runtime.Port>();

function broadcastToDevtools(message: any) {
  panelPorts.forEach((port) => {
    try {
      port.postMessage(message);
    } catch (e) {
      console.error("Failed to send message to DevTools panel port:", e);
      // Assume port is disconnected and remove it (onDisconnect should handle this too)
      panelPorts.delete(port);
    }
  });
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "traceform-panel") {
    panelPorts.add(port);
    console.log(`DevTools panel connected. Total ports: ${panelPorts.size}`);
    appendMessageToPanelLog(`[Info] Panel connection established.`); // Send log message

    // Send initial status immediately upon connection
    try {
        port.postMessage({ type: "status", status: socket && socket.readyState === WebSocket.OPEN ? "Connected to Bridge Server" : "Disconnected from Bridge Server" });
        port.postMessage({ type: "serverStatus", status: lastServerStatus ?? 'idle', url: targetUrl });
    } catch (e) {
        console.error("Error sending initial status to newly connected panel:", e);
    }


    port.onDisconnect.addListener(() => {
      panelPorts.delete(port);
      console.log(`DevTools panel disconnected. Total ports: ${panelPorts.size}`);
    });

    // Optional: Handle messages *from* the panel if needed (e.g., requests for specific data)
    // port.onMessage.addListener((msg) => {
    //   console.log("Message received from panel:", msg);
    // });
  }
});

// Helper to send log messages specifically to the panel
function appendMessageToPanelLog(logMessage: string) {
    broadcastToDevtools({ type: "log", message: logMessage });
}
// --- End DevTools Panel Communication ---


// Instead, always use a default target if not set
function getEffectiveTargetUrl(): string {
  // Default to localhost:5173 if not set
  return targetUrl || "http://localhost:5173/";
}


// Function to find and reload the target tab
async function refreshTargetTab() {
  const effectiveUrl = getEffectiveTargetUrl(); // Use the potentially defaulted URL
  console.warn(`Attempting refresh for effective URL: ${effectiveUrl}`);
  appendMessageToPanelLog(`Attempting refresh for effective URL: ${effectiveUrl}`);

  try {
    // Find tabs matching the target URL (ignoring trailing slash)
    const urlPattern = effectiveUrl.endsWith('/') ? effectiveUrl.slice(0, -1) : effectiveUrl;
    const tabs = await chrome.tabs.query({ url: `${urlPattern}*` }); // Match prefix

    if (tabs.length > 0 && tabs[0].id) {
      const tabId = tabs[0].id;
      console.log(`Found target tab ${tabId} matching ${urlPattern}*. Reloading...`);
      appendMessageToPanelLog(`Found target tab ${tabId}. Reloading...`);
      await chrome.tabs.reload(tabId);
      broadcastToDevtools({ type: "status", message: `Reloaded tab ${tabId} (${effectiveUrl})` }); // Use effectiveUrl in message
    } else {
      console.warn(`No open tab found matching URL pattern: ${urlPattern}*`);
      broadcastToDevtools({ type: "error", message: `No open tab found for ${effectiveUrl}` }); // Use effectiveUrl
    }
  } catch (error: any) { // Added type annotation
    console.error('Error refreshing target tab:', error);
    broadcastToDevtools({ type: "error", message: `Error refreshing tab: ${error?.message || error}` }); // Improved error message
  }
}

// [DUPLICATED CODE REMOVED HERE]

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
      targetUrl = msg.url; // Update the global targetUrl
      lastServerStatus = 'checking'; // Reset status on new URL set
      broadcastToDevtools({ type: "serverStatus", status: lastServerStatus, url: targetUrl }); // Notify panel immediately
      await chrome.storage.local.set({ targetUrl: targetUrl });
      startServerCheck(); // Restart check interval with new URL
      sendResponse({ success: true });
    } catch (error: any) { // Added type annotation
      sendResponse({ success: false, error: error?.message || error?.toString() }); // Improved error reporting
    }
    return true;
  }
  // Handle refreshTargetTab
  if (msg.type === 'refreshTargetTab') {
    try {
      await refreshTargetTab();
      sendResponse({ success: true });
    } catch (error: any) { // Added type annotation
      sendResponse({ success: false, error: error?.message || error?.toString() }); // Improved error reporting
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
  if (!targetUrl) {
      if (lastServerStatus !== 'idle') {
          lastServerStatus = 'idle';
          broadcastToDevtools({ type: "serverStatus", status: lastServerStatus, url: null });
      }
      return;
  }

  let currentStatus: 'up' | 'down' = 'down'; // Assume down unless proven otherwise
  try {
    // Use fetch with HEAD request and AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHECK_INTERVAL - 500); // Timeout slightly less than interval

    // Use 'cors' mode if possible, fallback to 'no-cors' might hide actual errors
    const response = await fetch(targetUrl, { method: 'HEAD', signal: controller.signal, mode: 'cors', cache: 'no-cache' });
    clearTimeout(timeoutId);

    // Check if the response status indicates success (e.g., 2xx or 3xx)
    // A specific health endpoint returning 200 OK would be ideal.
    if (response.ok || (response.type === 'opaque' && response.status === 0)) { // Treat opaque success as 'up' for basic check
        currentStatus = 'up';
    } else {
        // Server responded, but not with success (e.g., 404, 500)
        console.warn(`Server check for ${targetUrl} returned status: ${response.status}`);
        currentStatus = 'down'; // Or potentially a different status like 'error' or 'unhealthy'
    }

  } catch (error: any) {
     // Network errors typically mean the server is down or unreachable
     if (error.name === 'AbortError') {
        console.warn(`Server check for ${targetUrl} timed out.`);
     } else {
        // Log other fetch errors
        console.warn(`Server check for ${targetUrl} failed:`, error.message || error);
     }
     currentStatus = 'down';
  }

  // Only broadcast if status actually changes
  if (currentStatus !== lastServerStatus) {
    console.log(`Server status changed for ${targetUrl}: ${currentStatus}`);
    lastServerStatus = currentStatus;
    broadcastToDevtools({ type: "serverStatus", status: currentStatus, url: targetUrl }); // Broadcast the change
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
     // If targetUrl is cleared, ensure status is set to idle
     if (lastServerStatus !== 'idle') {
        console.log('Target URL cleared, stopping server check.');
        lastServerStatus = 'idle';
        broadcastToDevtools({ type: "serverStatus", status: "idle", url: null }); // Notify panel it's idle
     }
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
    // Optional: Update extension icon or title
    chrome.action.setTitle({ title: 'Traceform (Connected)' }); // Use consistent naming
    // chrome.action.setIcon({ path: "images/icon_active16.png" });
    broadcastToDevtools({ type: "status", status: "Connected to Bridge Server" });
    appendMessageToPanelLog('[Info] WebSocket connection established.');
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

      // Instead of just looking for the active tab, always use the effective target URL (default to localhost:5173)
      const urlToMatch = getEffectiveTargetUrl();
      let urlPattern = urlToMatch;
      if (!urlPattern.endsWith('/')) urlPattern += '/';
      urlPattern += '*';

      chrome.tabs.query({ url: urlPattern }, (tabs) => {
        if (tabs && tabs.length > 0 && tabs[0].id) {
          const targetTabId = tabs[0].id;
          // console.log(`Relaying message to target tab ID: ${targetTabId}`, message); // Less verbose logging

          // Send message to content script
          chrome.tabs.sendMessage(targetTabId, message, (response) => {
            // Optional: Handle response from content script (e.g., ack, error)
            if (chrome.runtime.lastError) {
              console.error(`Error sending message to tab ${targetTabId}:`, chrome.runtime.lastError.message);
              // Potentially notify the panel if sending fails consistently
              broadcastToDevtools({ type: "error", message: `Failed to send message to content script. Try refreshing the target page. (${chrome.runtime.lastError.message})` });
            } else {
              // console.log("Response from content script:", response); // For debugging
            }
          });
        } else {
          // Only log error if we expected to find a tab
          if (targetUrl) { // Check if a target was actually set
             chrome.tabs.query({}, (allTabs) => {
               const urls = allTabs.map(tab => tab.url).filter(Boolean);
               console.error(`Could not find tab matching target URL: ${urlPattern}. Open tabs:`, urls);
               broadcastToDevtools({ type: "error", message: `Could not find tab matching target URL: ${urlPattern}` });
             });
          }
        }
      });
    } catch (error: any) { // Added type annotation
      console.error('Failed to parse WebSocket message:', error);
      appendMessageToPanelLog(`[Error] Failed to parse WebSocket message: ${error?.message || error}`);
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
    // Optional: Update icon/title
     chrome.action.setTitle({ title: 'Traceform (Disconnected)' }); // Use consistent naming
    // chrome.action.setIcon({ path: "images/icon16.png" });
    broadcastToDevtools({ type: "status", status: "Disconnected from Bridge Server" });
    appendMessageToPanelLog(`[Warning] WebSocket closed (Code: ${event.code}). Reconnecting in ${reconnectInterval / 1000}s.`);

    // Attempt to reconnect with exponential backoff
    setTimeout(connectWebSocket, reconnectInterval);
    // Increase interval for next time, up to max
    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
  };
}

connectWebSocket();

chrome.runtime.onStartup.addListener(() => {
  connectWebSocket();
});
chrome.runtime.onInstalled.addListener(() => {
  connectWebSocket();
});
// Keep service worker alive logic (if needed, less common in MV3 with events)
// chrome.runtime.onMessage.addListener(...); // Keep alive if messages are frequent
