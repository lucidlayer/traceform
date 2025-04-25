// SPDX-License-Identifier: BUSL-1.1
import { createTraceformError, handleTraceformError } from '../shared/src/traceformError';

const urlInput = document.getElementById('targetUrl');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

// Load the saved URL when the popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['targetUrl'], (result) => {
    if (result.targetUrl) {
      urlInput.value = result.targetUrl;
    } else {
      // Optionally set a default placeholder if nothing is saved
      urlInput.placeholder = 'e.g., http://localhost:5173';
    }
  });
});

// Save the URL when the button is clicked
saveButton.addEventListener('click', () => {
  const newUrl = urlInput.value.trim();
  if (newUrl) {
    // Basic validation (could be more robust)
    try {
      new URL(newUrl); // Check if it's a valid URL format
      chrome.storage.local.set({ targetUrl: newUrl }, () => {
        statusDiv.textContent = 'URL saved!';
        // Send message to background script to update its internal state immediately
        chrome.runtime.sendMessage({ type: 'setTargetUrl', url: newUrl }, (response) => {
          if (chrome.runtime.lastError) {
            // Use TraceformError for background communication error
            const err = createTraceformError(
              'TF-BE-001',
              'Error sending message to background',
              chrome.runtime.lastError,
              'browserExt.popup.sendMessage.error',
              true // telemetry
            );
            handleTraceformError(err, 'BrowserExtensionPopup'); // @ErrorFeedback
            console.error('Error sending message to background:', chrome.runtime.lastError.message);
            statusDiv.textContent = `Error notifying background: ${chrome.runtime.lastError.message}`;
            statusDiv.style.color = 'red';
          } else if (response && response.success) {
             console.log('Background script acknowledged URL update.');
          } else {
             // Use TraceformError for background response error
             const err = createTraceformError(
               'TF-BE-002',
               'Background script did not acknowledge or reported failure',
               response,
               'browserExt.popup.backgroundResponse.error',
               false // not critical for telemetry
             );
             handleTraceformError(err, 'BrowserExtensionPopup'); // @ErrorFeedback
             console.warn('Background script did not acknowledge or reported failure:', response);
             statusDiv.textContent = `Background script response: ${JSON.stringify(response)}`;
             statusDiv.style.color = 'orange';
          }
        });
        setTimeout(() => { statusDiv.textContent = ''; statusDiv.style.color = 'green'; }, 2000); // Clear status after 2s
      });
    } catch (e) {
      // Use TraceformError for invalid URL format
      const err = createTraceformError(
        'TF-BE-003',
        'Invalid URL format',
        e,
        'browserExt.popup.invalidUrl.error',
        false // not critical for telemetry
      );
      handleTraceformError(err, 'BrowserExtensionPopup'); // @ErrorFeedback
      statusDiv.textContent = 'Invalid URL format.';
      statusDiv.style.color = 'red';
       setTimeout(() => { statusDiv.textContent = ''; statusDiv.style.color = 'green'; }, 2000);
    }
  } else {
    // Use TraceformError for empty input
    const err = createTraceformError(
      'TF-BE-004',
      'URL cannot be empty',
      null,
      'browserExt.popup.emptyUrl.error',
      false // not critical for telemetry
    );
    handleTraceformError(err, 'BrowserExtensionPopup'); // @ErrorFeedback
    statusDiv.textContent = 'URL cannot be empty.';
    statusDiv.style.color = 'red';
    setTimeout(() => { statusDiv.textContent = ''; statusDiv.style.color = 'green'; }, 2000);
  }
});
