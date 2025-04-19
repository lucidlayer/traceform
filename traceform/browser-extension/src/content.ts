/*
// SPDX-License-Identifier: BUSL-1.1

Business Source License 1.1

Parameters
  Licensor:      LucidLayer Inc.
  Licensed Work: traceform/browser-extension
  Additional Use Grant: Production use for ≤ 3 dev seats is free
  Change Date:   2028-04-15
  Change License: Apache License 2.0

The text of the Business Source License 1.1 is as follows:

BUSINESS SOURCE LICENSE 1.1

...

[Full, unmodified BUSL 1.1 text goes here. For brevity, insert the official text verbatim from https://mariadb.com/bsl11/ including all sections, without omission or summary. The Parameters block above must appear at the top, as shown.]
*/

import { removeOverlays, highlightElements } from './overlay';

// --- Register Listener Immediately ---
console.log('[Content Script] Initializing listener...'); // Log initialization

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    console.log('[Content Script] Received message:', message, 'from sender:', sender); // Log received message and sender

    // Wrap the entire handler in a try...catch
    try {
      console.log('[Content Script] Processing message type:', message.type); // Log processing start

      // Always clear previous overlays before potentially adding new ones
      console.log('[Content Script] Calling removeOverlays()');
      removeOverlays();

      if (message.type === 'HIGHLIGHT_COMPONENT') {
        if (message.traceformId) { // Check for traceformId
          console.log(`[Content Script] Attempting highlight for traceformId: ${message.traceformId}`);
          try {
            highlightElements(message.traceformId); // Pass the full ID
            console.log(`[Content Script] highlightElements completed for: ${message.traceformId}`);
          } catch (highlightError) {
            console.error('[Content Script] Error during highlightElements:', highlightError);
            // Optionally send feedback to the DevTools panel about the error
          }
        } else {
          console.error('[Content Script] Highlight command missing traceformId');
        }
      } else if (message.type === 'CLEAR_HIGHLIGHT') {
        // removeOverlays() is already called above, so this case might become redundant
        // unless CLEAR_HIGHLIGHT needs to do something *else* specifically.
        // For now, keep it simple: clearing happens at the start of message handling.
        console.log('[Content Script] Clear highlight message received (overlays already removed).');
      }

      // Send a simple response to acknowledge receipt
      console.log('[Content Script] Sending success response.'); // Log before sending response
      sendResponse({ success: true, processed: true }); // Add processed flag

    } catch (error) {
      console.error("[Content Script] Error processing message:", error); // Updated log prefix
      // Attempt to send an error response if possible
      try {
        sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
      } catch (sendError) {
        console.error("Failed to send error response:", sendError);
      }
    }

    // Return true to indicate you intend to send a response asynchronously
    // (even though we send it synchronously here, this pattern is safer
    // for message channel management).
    // return true; // Removed as response is sent synchronously
  }
);
// --- End Listener Registration ---


console.log('[Content Script] Code-to-UI Mapper: Content script loaded and listener added.'); // Updated log prefix

// Define expected message structure
interface HighlightMessage {
  type: 'HIGHLIGHT_COMPONENT';
  traceformId: string; // Use the full ID
}

interface ClearHighlightMessage {
  type: 'CLEAR_HIGHLIGHT';
}

type ExtensionMessage = HighlightMessage | ClearHighlightMessage;


// Optional: Clear highlights if the user clicks away or navigates
document.addEventListener('click', () => {
 // Simple click clears highlights, could be more sophisticated
 // removeOverlays();
});

// Note: Handling page navigation/SPA transitions might require MutationObserver
// or listening to specific framework events if available.
