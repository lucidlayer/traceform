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
            console.error('Error sending message to background:', chrome.runtime.lastError.message);
            statusDiv.textContent = `Error notifying background: ${chrome.runtime.lastError.message}`;
            statusDiv.style.color = 'red';
          } else if (response && response.success) {
             console.log('Background script acknowledged URL update.');
          } else {
             console.warn('Background script did not acknowledge or reported failure:', response);
             statusDiv.textContent = `Background script response: ${JSON.stringify(response)}`;
             statusDiv.style.color = 'orange';
          }
        });
        setTimeout(() => { statusDiv.textContent = ''; statusDiv.style.color = 'green'; }, 2000); // Clear status after 2s
      });
    } catch (e) {
      statusDiv.textContent = 'Invalid URL format.';
      statusDiv.style.color = 'red';
       setTimeout(() => { statusDiv.textContent = ''; statusDiv.style.color = 'green'; }, 2000);
    }
  } else {
    // Handle empty input if needed, e.g., clear storage or show error
    statusDiv.textContent = 'URL cannot be empty.';
    statusDiv.style.color = 'red';
    setTimeout(() => { statusDiv.textContent = ''; statusDiv.style.color = 'green'; }, 2000);
  }
});
