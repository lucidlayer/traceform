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

import { createTraceformError, handleTraceformError } from '../../shared/src/traceformError';

const OVERLAY_CONTAINER_ID = 'traceform-overlay-container';
const OVERLAY_CLASS = 'traceform-highlight-overlay';
const OVERLAY_STYLE_ID = 'traceform-highlight-overlay-style';

// Inject minimal CSS for the highlight overlay if not already present
function ensureOverlayStyle() {
  if (!document.getElementById(OVERLAY_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = OVERLAY_STYLE_ID;
    style.textContent = `
.traceform-highlight-overlay {
  background: rgba(127, 217, 98, 0.25);
  border: 2px solid #7fd962;
  border-radius: 4px;
  pointer-events: none;
  box-sizing: border-box;
  z-index: 1000000;
}
    `.trim();
    document.head.appendChild(style);
  }
}

// Ensure the overlay container exists
function getOverlayContainer(): HTMLElement {
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
export function removeOverlays(): void {
  const container = document.getElementById(OVERLAY_CONTAINER_ID);
  if (container) {
    container.innerHTML = ''; // Clear previous overlays
  }
}

// Create and add overlays for found elements
export function highlightElements(traceformId: string): void { // Accept full traceformId
  removeOverlays(); // Clear previous highlights first
  ensureOverlayStyle(); // Inject minimal overlay CSS
  const container = getOverlayContainer();

  // Find all elements matching the full data-traceform-id attribute
  const selector = `[data-traceform-id="${traceformId}"]`; // Use full ID in selector
  console.log(`[Traceform Overlay] Attempting querySelectorAll with selector: ${selector}`); // Added log
  let elements: NodeListOf<HTMLElement>;
  try {
    elements = document.querySelectorAll<HTMLElement>(selector);
  } catch (queryError) {
    // Use TraceformError for selector/query failure
    const err = createTraceformError(
      'TF-OV-002',
      '[Overlay] Error querying elements for traceformId',
      queryError,
      'overlay.query.error',
      true // telemetry
    );
    handleTraceformError(err, 'OverlayRenderer'); // @ErrorFeedback
    return;
  }
  if (elements.length === 0) {
    // Use TraceformError for no elements found
    const err = createTraceformError(
      'TF-OV-001',
      `No elements found for traceformId: ${traceformId}`,
      { traceformId },
      'overlay.noElements',
      false // not critical for telemetry
    );
    handleTraceformError(err, 'OverlayRenderer'); // @ErrorFeedback
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
