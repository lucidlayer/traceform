import { removeOverlays, highlightElements } from './overlay';

console.log('Code-to-UI Mapper: Content script loaded.');

// Define expected message structure
interface HighlightMessage {
  type: 'HIGHLIGHT_COMPONENT';
  traceformId: string; // Use the full ID
}

interface ClearHighlightMessage {
  type: 'CLEAR_HIGHLIGHT';
}

type ExtensionMessage = HighlightMessage | ClearHighlightMessage;

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    console.log('Content script received message:', message);

    if (message.type === 'HIGHLIGHT_COMPONENT') {
      if (message.traceformId) { // Check for traceformId
        highlightElements(message.traceformId); // Pass the full ID
        // Indicate success (optional)
        // sendResponse({ status: 'Highlighting initiated' });
      } else {
        console.error('Highlight command missing traceformId');
        // sendResponse({ status: 'Error: Missing componentName' });
      }
    } else if (message.type === 'CLEAR_HIGHLIGHT') {
      removeOverlays();
      // sendResponse({ status: 'Highlights cleared' });
    }

    // Return true to indicate you wish to send a response asynchronously
    // (if you uncomment sendResponse calls)
    return true; // Keep the message channel open for potential async responses
  }
);

// Optional: Clear highlights if the user clicks away or navigates
document.addEventListener('click', () => {
 // Simple click clears highlights, could be more sophisticated
 // removeOverlays();
});

// Note: Handling page navigation/SPA transitions might require MutationObserver
// or listening to specific framework events if available.
