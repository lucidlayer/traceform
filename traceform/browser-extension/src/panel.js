// src/panel.js

// Get UI elements
const targetUrlInput = document.getElementById('targetUrl');
const setTargetBtn = document.getElementById('setTargetBtn');
const currentTargetSpan = document.getElementById('currentTarget');
const bridgeStatusSpan = document.getElementById('bridgeStatus');
const serverStatusSpan = document.getElementById('serverStatus');
const messagesEl = document.getElementById('messages');
const errorSectionDiv = document.getElementById('errorSection');
const errorMessageSpan = document.getElementById('errorMessage');
const connectionErrorSpan = document.getElementById('connectionError'); // Get the new span
const refreshTargetBtn = document.getElementById('refreshTargetBtn');

// Utility to update bridge status
function setBridgeStatus(status, type) {
  const statusEl = bridgeStatusSpan; // Use the correct span
  if (statusEl) {
    statusEl.textContent = status;
    statusEl.className = ''; // Clear previous classes
    if (type) statusEl.classList.add(type);
  }
}

// Utility to update server status
function setServerStatus(status) {
  if (serverStatusSpan) {
    serverStatusSpan.textContent = status;
  }
}

// Utility to update current target display
function setCurrentTargetDisplay(url) {
  if (currentTargetSpan) {
    currentTargetSpan.textContent = url || 'None';
  }
}

// Utility to append a message
function appendMessage(msg) {
  if (messagesEl) {
    if (messagesEl.textContent === 'Waiting for status updates...') {
      messagesEl.textContent = ''; // Clear initial message
    }
    const timestamp = new Date().toLocaleTimeString();
    messagesEl.textContent += `[${timestamp}] ${msg}\n`;
    messagesEl.scrollTop = messagesEl.scrollHeight; // Auto-scroll
  }
}

// --- Initialization ---

// Initial state
setBridgeStatus('Disconnected', 'status-disconnected');
setServerStatus('Idle');
appendMessage('DevTools panel loaded. Waiting for background connection...');

const port = chrome.runtime.connect({ name: "traceform-panel" });
appendMessage('Attempting connection to background script...');

// Notify background that the panel is ready (still use port for this initial handshake)
port.postMessage({ type: 'panelReady' });
console.log('Sent panelReady message to background.');
appendMessage('Sent panelReady message to background.');

// Request stored URL using sendMessage
chrome.runtime.sendMessage({ type: 'getStoredTargetUrl' }, (response) => {
  if (chrome.runtime.lastError) {
    appendMessage(`[Error] Failed to get stored target URL: ${chrome.runtime.lastError.message}`);
    setBridgeStatus("Disconnected (Error)", "status-disconnected");
    if (connectionErrorSpan && errorSectionDiv) {
      errorMessageSpan.style.display = 'none'; // Hide generic error
      connectionErrorSpan.style.display = 'inline'; // Show specific connection error
      errorSectionDiv.style.display = 'block';
    }
    setCurrentTargetDisplay('None');
    return;
  }
  console.log("[PANEL CONSOLE] Received response for getStoredTargetUrl:", response);
  if (response && response.url) {
    appendMessage(`Received stored URL via sendMessage: ${response.url}`);
    targetUrlInput.value = response.url;
    setCurrentTargetDisplay(response.url);
    // Optionally trigger monitoring immediately
    // chrome.runtime.sendMessage({ type: 'setTargetUrl', url: response.url });
    // setServerStatus(`Monitoring (${response.url})...`);
  } else {
    appendMessage(`No stored URL found via sendMessage.`);
    setCurrentTargetDisplay('None');
  }
});
appendMessage('Requested stored target URL via sendMessage.');

// Keep listening on the port for background->panel pushes
port.onMessage.addListener((msg) => {
  // --- DEBUGGING: Focus on logging received messages ---
  console.log("[PANEL CONSOLE] Received message:", msg);

  // Restore UI update logic
  // /* // Remove start comment
  appendMessage(`Received: ${JSON.stringify(msg)}`); // Log all messages for debugging

  if (msg.type === "status") {
    // Handle bridge status updates
    if (msg.status === "Connected to Bridge Server") {
      setBridgeStatus("Connected", "status-connected");
    } else if (msg.status === "Disconnected from Bridge Server") {
      setBridgeStatus("Disconnected", "status-disconnected");
    } else if (msg.status === "Panel connected") {
       // Ignore this internal message for UI status, maybe log it
       appendMessage(`[Info] Panel connection established.`);
       // Request initial status from background if needed
       // port.postMessage({ type: 'getInitialStatus' });
    }
    // Removed incorrect nesting here
    else { // Handle other potential status messages if needed
      setBridgeStatus(msg.status, "status-error"); // Default to error style
    }
  } else if (msg.type === "storedTargetUrl") { // Correct placement
     // Handle receiving the stored URL from background
     appendMessage(`Received stored URL: ${msg.url || 'None'}`);
       if (msg.url) {
         targetUrlInput.value = msg.url;
         setCurrentTargetDisplay(msg.url);
         // Optionally trigger monitoring immediately if URL exists
         // port.postMessage({ type: 'setTargetUrl', url: msg.url });
         // setServerStatus(`Monitoring (${msg.url})...`);
       } else {
         setCurrentTargetDisplay('None');
       }
    // Removed incorrect else block here
  } else if (msg.type === "error") {
    // Handle specific errors like content script missing (Keep this as is, it's not a background connection error)
    appendMessage(`[Error] ${msg.message}`);
    if (errorMessageSpan && errorSectionDiv) {
        connectionErrorSpan.style.display = 'none'; // Hide connection error
        errorMessageSpan.textContent = "⚠️ Content script connection lost. Refresh required.";
        errorMessageSpan.style.display = 'inline'; // Show generic error
        errorSectionDiv.style.display = 'block';
    }
  } else if (msg.type === "serverStatus") {
     // Handle dev server status updates
     setServerStatus(`${msg.status.toUpperCase()} (${msg.url || 'N/A'})`); // Handle null URL
     appendMessage(`[Server Status] ${msg.url || 'N/A'} is ${msg.status}`);
     // Hide error section if server status updates (implies connection is likely okay or re-established)
     if (errorSectionDiv) {
         errorSectionDiv.style.display = 'none';
         errorMessageSpan.style.display = 'none';
         connectionErrorSpan.style.display = 'none';
     }
  } else {
    // Log unexpected messages
    appendMessage(`[Unknown Message] ${JSON.stringify(msg)}`);
  }
  // */ // Remove end comment
  // --- END DEBUGGING ---
});

port.onDisconnect.addListener(() => {
  setBridgeStatus("Disconnected (Port Closed)", "status-disconnected");
  appendMessage("[Error] Connection to background script lost.");
  if (connectionErrorSpan && errorSectionDiv) {
      errorMessageSpan.style.display = 'none'; // Hide generic error
      connectionErrorSpan.style.display = 'inline'; // Show specific connection error
      errorSectionDiv.style.display = 'block';
  }
  // Optionally disable UI elements
});

// --- Keep Alive ---
let keepAliveIntervalId = null;
let lastPongReceived = Date.now();

function startKeepAlive() {
  console.log('[PANEL CONSOLE] Starting keep-alive ping.');
  appendMessage('[Info] Starting keep-alive.');
  lastPongReceived = Date.now(); // Reset timer

  if (keepAliveIntervalId) clearInterval(keepAliveIntervalId); // Clear previous interval if any

  keepAliveIntervalId = setInterval(() => {
    // Check if we received a pong recently, otherwise assume connection is dead
    if (Date.now() - lastPongReceived > 45000) { // Allow 45s without pong
      console.error('[PANEL CONSOLE] Keep-alive pong timeout. Connection likely lost.');
      appendMessage('[Error] Keep-alive timeout. Connection lost.');
      setBridgeStatus("Disconnected (Timeout)", "status-disconnected");
      if (connectionErrorSpan && errorSectionDiv) {
          errorMessageSpan.style.display = 'none'; // Hide generic error
          connectionErrorSpan.style.display = 'inline'; // Show specific connection error
          errorSectionDiv.style.display = 'block';
      }
      clearInterval(keepAliveIntervalId);
      keepAliveIntervalId = null;
      // We might not be able to postMessage if the port is truly closed, but try
      try { port.disconnect(); } catch(e) {}
      return;
    }

    try {
      port.postMessage({ type: 'ping' }); // Send ping instead of keepAlive
      // console.log('[PANEL CONSOLE] Sent ping.'); // Optional: uncomment for debugging
    } catch (error) {
      console.error('[PANEL CONSOLE] Error sending ping (port likely closed):', error);
      appendMessage('[Error] Failed to send ping. Connection lost?');
      clearInterval(keepAliveIntervalId);
      keepAliveIntervalId = null;
    }
  }, 20000); // Send ping every 20 seconds
}



// --- UI Event Listeners ---

setTargetBtn.addEventListener('click', () => {
  console.log("[PANEL CONSOLE] Set Target button clicked."); // Add console log
  if (errorSectionDiv) errorSectionDiv.style.display = 'none'; // Hide error on new target set
  const url = targetUrlInput.value.trim();
  appendMessage(`Attempting to set target URL: ${url}`); // Log attempt
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    // Don't save to storage here; background script handles it.
    // Just update UI optimistically and send message.
    appendMessage(`Setting target URL: ${url}`);
    setCurrentTargetDisplay(url);
    // Send to background script using sendMessage
    const messageToSend = { type: 'setTargetUrl', url: url };
    console.log("[PANEL CONSOLE] Sending message to background via sendMessage:", messageToSend);
    chrome.runtime.sendMessage(messageToSend, (response) => {
        if (chrome.runtime.lastError) {
            appendMessage(`[Error] Failed to set target URL: ${chrome.runtime.lastError.message}`);
            setBridgeStatus("Disconnected (Error)", "status-disconnected");
            if (connectionErrorSpan && errorSectionDiv) {
              errorMessageSpan.style.display = 'none'; // Hide generic error
              connectionErrorSpan.style.display = 'inline'; // Show specific connection error
              errorSectionDiv.style.display = 'block';
            }
            // alert("Error setting target URL in background script."); // Avoid alert, use inline message
            return;
        }
        // Optional: handle response from background if needed
        console.log("[PANEL CONSOLE] Response from setTargetUrl:", response);
        if (response?.success) {
             appendMessage(`Background confirmed target URL set: ${url}`);
        } else {
             appendMessage(`[Error] Background failed to set target URL.`);
             alert("Error setting target URL in background script.");
        }
    });
    setServerStatus(`Monitoring (${url})...`); // Update UI optimistically
  } else {
    alert('Please enter a valid URL (starting with http:// or https://)');
  }
});

refreshTargetBtn.addEventListener('click', () => {
  console.log("[PANEL CONSOLE] Refresh Target button clicked.");
  appendMessage('Attempting to refresh target tab...');
  // Send message to background using sendMessage
  const messageToSend = { type: 'refreshTargetTab' };
  console.log("[PANEL CONSOLE] Sending message to background via sendMessage:", messageToSend);
  chrome.runtime.sendMessage(messageToSend, (response) => {
      if (chrome.runtime.lastError) {
          appendMessage(`[Error] Failed to refresh target tab: ${chrome.runtime.lastError.message}`);
          setBridgeStatus("Disconnected (Error)", "status-disconnected");
          if (connectionErrorSpan && errorSectionDiv) {
            errorMessageSpan.style.display = 'none'; // Hide generic error
            connectionErrorSpan.style.display = 'inline'; // Show specific connection error
            errorSectionDiv.style.display = 'block';
          }
          // alert(`Error refreshing tab: ${chrome.runtime.lastError.message}`); // Avoid alert
          return;
      }
      console.log("[PANEL CONSOLE] Response from refreshTargetTab:", response);
       if (response?.success) {
           appendMessage(`Background initiated tab refresh.`);
       } else {
           appendMessage(`[Error] Background failed to initiate refresh: ${response?.error || 'Unknown error'}`);
           alert(`Error refreshing tab: ${response?.error || 'Unknown error'}`);
       }
  });
  // Hide the error message optimistically
  if (errorSectionDiv) errorSectionDiv.style.display = 'none';
});

// Remove the keep-alive interval as we are reducing reliance on the long-lived port
if (keepAliveIntervalId) clearInterval(keepAliveIntervalId);
keepAliveIntervalId = null;
