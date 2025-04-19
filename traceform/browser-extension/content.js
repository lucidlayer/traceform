// SPDX-License-Identifier: BUSL-1.1
import { removeOverlays, highlightElements } from './overlay';
console.log('Code-to-UI Mapper: Content script loaded.');
// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    // Always clear previous overlays before potentially adding new ones
    removeOverlays();
    if (message.type === 'HIGHLIGHT_COMPONENT') {
        if (message.traceformId) { // Check for traceformId
            try {
                // console.log(`Attempting to highlight elements with ID: ${message.traceformId}`);
                highlightElements(message.traceformId); // Pass the full ID
            }
            catch (error) {
                console.error('Error during highlightElements:', error);
                // Optionally send feedback to the DevTools panel about the error
            }
        }
        else {
            console.error('Highlight command missing traceformId');
        }
    }
    else if (message.type === 'CLEAR_HIGHLIGHT') {
        // removeOverlays() is already called above, so this case might become redundant
        // unless CLEAR_HIGHLIGHT needs to do something *else* specifically.
        // For now, keep it simple: clearing happens at the start of message handling.
        console.log('Clear highlight message received (overlays already removed).');
    }
    // Do not return true; we are not using sendResponse asynchronously
    // This avoids the "message channel closed before a response was received" error
});
// Optional: Clear highlights if the user clicks away or navigates
document.addEventListener('click', () => {
    // Simple click clears highlights, could be more sophisticated
    // removeOverlays();
});
// Note: Handling page navigation/SPA transitions might require MutationObserver
// or listening to specific framework events if available.
//# sourceMappingURL=content.js.map