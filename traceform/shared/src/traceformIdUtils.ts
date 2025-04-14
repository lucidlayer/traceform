/**
 * Creates a standardized Traceform ID.
 * Format: relativeFilePath::ComponentName::instanceIndex
 *
 * @param relativePath - The file path relative to the project root, using forward slashes.
 * @param componentName - The detected name of the React component.
 * @param instanceIndex - The index of the component instance (default is 0).
 * @returns The standardized Traceform ID string.
 */
export function createTraceformId(
  relativePath: string,
  componentName: string,
  instanceIndex: number = 0
): string {
  // Basic validation
  if (!relativePath || !componentName) {
    console.warn('[Traceform Shared Util] Missing relativePath or componentName for createTraceformId');
    // Return a placeholder or throw an error, depending on desired strictness
    // For now, return an identifiable invalid ID
    return 'invalid::invalid::invalid';
  }

  // Ensure forward slashes just in case
  const normalizedPath = relativePath.replace(/\\/g, '/');

  return `${normalizedPath}::${componentName}::${instanceIndex}`;
}

// Potential future additions:
// - Function to parse a Traceform ID back into its parts
// - More robust validation
