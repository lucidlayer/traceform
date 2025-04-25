// SPDX-License-Identifier: BUSL-1.1
/**
 * Traceform Central Error Handling Utilities
 * Implements the TraceformError interface, error code scheme, and central handler.
 * See memory_docs/codeMap_root.md and components_index.yaml for documentation.
 *
 * Error Code Format: TF-[COMP]-[ERRNO] (e.g., TF-BG-001)
 * All errors should use this structure and be routed through handleTraceformError.
 * I18N and telemetry hooks are stubbed for future implementation.
 */

export interface TraceformError {
  code: string; // e.g., "TF-BG-001"
  message: string; // User-facing or log message
  details?: any; // Optional: stack, context, etc.
  i18nKey?: string; // For future localization
  telemetry?: boolean; // Flag for telemetry reporting
}

/**
 * Central error handler for all Traceform tools.
 * Logs, surfaces to UI/DevTools, and triggers telemetry/I18N hooks as needed.
 *
 * @param error - TraceformError object
 * @param context - Optional context (component, step, etc.)
 */
export function handleTraceformError(error: TraceformError, context?: string) {
  // Log error with code and context
  const ctx = context ? `[${context}]` : '';
  // eslint-disable-next-line no-console
  console.error(`%c[${error.code}]${ctx} ${error.message}`, 'color: red; font-weight: bold;', error.details || '');

  // TODO: Surface to UI/DevTools if available (e.g., postMessage, panel log)
  // TODO: Integrate with I18N system using error.i18nKey
  // TODO: Trigger telemetry event if error.telemetry is true
  // Example stub:
  if (error.telemetry) {
    // sendTelemetryEvent('errorEncountered', { code: error.code, ... })
  }
}

/**
 * Utility to create a TraceformError with standard fields.
 * @param code - Error code (TF-[COMP]-[ERRNO])
 * @param message - User-facing or log message
 * @param details - Optional details (stack, context, etc.)
 * @param i18nKey - Optional I18N key
 * @param telemetry - Flag for telemetry reporting
 */
export function createTraceformError(
  code: string,
  message: string,
  details?: any,
  i18nKey?: string,
  telemetry: boolean = true
): TraceformError {
  return { code, message, details, i18nKey, telemetry };
}

// Example usage (to be replaced in all onboarding/core components):
// throw createTraceformError('TF-BG-001', 'WebSocket connection failed', { url: ... });
// handleTraceformError(error, 'BrowserStep'); 