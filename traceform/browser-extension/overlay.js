// SPDX-License-Identifier: BUSL-1.1
const OVERLAY_CONTAINER_ID = 'traceform-overlay-container';
const OVERLAY_CLASS = 'traceform-highlight-overlay';
// Ensure the overlay container exists
function getOverlayContainer() {
    let container = document.getElementById(OVERLAY_CONTAINER_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = OVERLAY_CONTAINER_ID;
        // Basic styling to ensure it covers the page and doesn't interfere
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = `${document.documentElement.scrollHeight}px`; // Cover full scroll height
        container.style.zIndex = '999999'; // High z-index
        container.style.pointerEvents = 'none'; // Allow clicks to pass through
        document.body.appendChild(container);
    }
    // Update height in case document size changed
    container.style.height = `${document.documentElement.scrollHeight}px`;
    return container;
}
// Remove all existing overlays
export function removeOverlays() {
    const container = document.getElementById(OVERLAY_CONTAINER_ID);
    if (container) {
        container.innerHTML = ''; // Clear previous overlays
    }
}
// Create and add overlays for found elements
export function highlightElements(traceformId) {
    removeOverlays(); // Clear previous highlights first
    const container = getOverlayContainer();
    // Find all elements matching the full data-traceform-id attribute
    const selector = `[data-traceform-id="${traceformId}"]`; // Use full ID in selector
    console.log(`[Traceform Overlay] Attempting querySelectorAll with selector: ${selector}`); // Added log
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        console.log(`No elements found for traceformId: ${traceformId}`);
        return;
    }
    console.log(`Highlighting ${elements.length} elements for: ${traceformId}`);
    elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.className = OVERLAY_CLASS;
        // Position the overlay exactly over the element
        overlay.style.position = 'absolute';
        overlay.style.top = `${rect.top + window.scrollY}px`; // Account for page scroll
        overlay.style.left = `${rect.left + window.scrollX}px`; // Account for page scroll
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        // Styling is now handled by src/styles.css via the OVERLAY_CLASS
        container.appendChild(overlay);
    });
}
//# sourceMappingURL=overlay.js.map