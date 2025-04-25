// SPDX-License-Identifier: BUSL-1.1
import { removeOverlays, highlightElements } from './overlay';
import { createTraceformError, handleTraceformError } from '../shared/src/traceformError';
console.log('Code-to-UI Mapper: Content script loaded.');
// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        console.log('Content script received message:', message);
        // Always clear previous overlays before potentially adding new ones
        removeOverlays();
        if (message.type === 'HIGHLIGHT_COMPONENT') {
            if (message.traceformId) {
                try {
                    highlightElements(message.traceformId);
                } catch (highlightError) {
                    // Use TraceformError for highlight error
                    const err = createTraceformError(
                        'TF-BE-020',
                        '[Content Script] Error during highlightElements',
                        highlightError,
                        'browserExt.content.highlight.error',
                        true // telemetry
                    );
                    handleTraceformError(err, 'ContentScript'); // @ErrorFeedback
                }
            } else {
                // Use TraceformError for missing traceformId
                const err = createTraceformError(
                    'TF-BE-021',
                    '[Content Script] Highlight command missing traceformId',
                    message,
                    'browserExt.content.highlight.missingId',
                    true // telemetry
                );
                handleTraceformError(err, 'ContentScript'); // @ErrorFeedback
            }
        } else if (message.type === 'CLEAR_HIGHLIGHT') {
            // removeOverlays() is already called above, so this case might become redundant
            // unless CLEAR_HIGHLIGHT needs to do something *else* specifically.
            // For now, keep it simple: clearing happens at the start of message handling.
            console.log('Clear highlight message received (overlays already removed).');
        }
        sendResponse({ success: true, processed: true });
    } catch (error) {
        // Use TraceformError for generic message processing error
        const err = createTraceformError(
            'TF-BE-022',
            '[Content Script] Error processing message',
            error,
            'browserExt.content.message.error',
            true // telemetry
        );
        handleTraceformError(err, 'ContentScript'); // @ErrorFeedback
        try {
            sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
        } catch (sendError) {
            // Use TraceformError for sendResponse failure
            const err2 = createTraceformError(
                'TF-BE-023',
                '[Content Script] Failed to send error response',
                sendError,
                'browserExt.content.sendResponse.error',
                false // not critical for telemetry
            );
            handleTraceformError(err2, 'ContentScript');
        }
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