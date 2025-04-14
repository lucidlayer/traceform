import { removeOverlays, highlightElements } from './overlay';

// --- Register Listener Immediately ---
// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    // Wrap the entire handler in a try...catch
    try {
      console.log('Content script received message:', message);

      // Always clear previous overlays before potentially adding new ones
      removeOverlays();

      if (message.type === 'HIGHLIGHT_COMPONENT') {
        if (message.traceformId) { // Check for traceformId
          try {
            // console.log(`Attempting to highlight elements with ID: ${message.traceformId}`);
            highlightElements(message.traceformId); // Pass the full ID
          } catch (highlightError) {
            console.error('Error during highlightElements:', highlightError);
            // Optionally send feedback to the DevTools panel about the error
          }
        } else {
          console.error('Highlight command missing traceformId');
        }
      } else if (message.type === 'CLEAR_HIGHLIGHT') {
        // removeOverlays() is already called above, so this case might become redundant
        // unless CLEAR_HIGHLIGHT needs to do something *else* specifically.
        // For now, keep it simple: clearing happens at the start of message handling.
        console.log('Clear highlight message received (overlays already removed).');
      }

      // Send a simple response to acknowledge receipt
      sendResponse({ success: true, processed: true }); // Add processed flag

    } catch (error) {
      console.error("Error processing message in content script:", error);
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
    return true;
  }
);
// --- End Listener Registration ---


console.log('Code-to-UI Mapper: Content script loaded and listener added.'); // Updated log

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
