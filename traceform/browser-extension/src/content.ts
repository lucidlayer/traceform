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
      } else {
        console.error('Highlight command missing traceformId');
      }
    } else if (message.type === 'CLEAR_HIGHLIGHT') {
      removeOverlays();
    }
    // Do not return true; we are not using sendResponse asynchronously
    // This avoids the "message channel closed before a response was received" error
  }
);

// Optional: Clear highlights if the user clicks away or navigates
document.addEventListener('click', () => {
 // Simple click clears highlights, could be more sophisticated
 // removeOverlays();
});

// Note: Handling page navigation/SPA transitions might require MutationObserver
// or listening to specific framework events if available.
