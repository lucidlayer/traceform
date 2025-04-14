import { PluginObj, PluginPass, NodePath } from '@babel/core';
import * as t from '@babel/types'; // Import babel types

// Define state if needed for the visitor
interface PluginState extends PluginPass {
  // Add any state properties needed during traversal
  // Add any state properties needed during traversal
}

import pathLib from 'path'; // Import path library for normalization

/**
 * Helper function to normalize path and make it workspace-relative,
 * always including the project directory (e.g., "traceform-test-app/src/components/Button.tsx").
 */
function normalizeAndMakeRelative(filePath: string, workspaceRoot: string | undefined): string {
  // DEBUG: Log all relevant paths for troubleshooting
  // eslint-disable-next-line no-console
  console.log('[Traceform Babel Plugin] filePath:', filePath);
  // eslint-disable-next-line no-console
  console.log('[Traceform Babel Plugin] workspaceRoot:', workspaceRoot);
  // eslint-disable-next-line no-console
  console.log('[Traceform Babel Plugin] process.cwd():', process.cwd());

  // Use the parent directory of the project as the workspace root
  // (Assume process.cwd() is the project root, so use its parent)
  let effectiveWorkspaceRoot = workspaceRoot;
  if (workspaceRoot && workspaceRoot === process.cwd()) {
    effectiveWorkspaceRoot = pathLib.dirname(process.cwd());
    // eslint-disable-next-line no-console
    console.log('[Traceform Babel Plugin] Using parent of project as workspace root:', effectiveWorkspaceRoot);
  }

  if (!effectiveWorkspaceRoot) {
    // Fallback if workspace root cannot be determined
    console.warn('[Traceform Babel Plugin] Could not determine workspace root. Using absolute path.');
    return filePath.replace(/\\/g, '/');
  }
  const normalizedFilePath = filePath.replace(/\\/g, '/');
  const normalizedWorkspaceRoot = effectiveWorkspaceRoot.replace(/\\/g, '/');
  // Ensure workspaceRoot doesn't have a trailing slash for relative path calculation
  const cleanWorkspaceRoot = normalizedWorkspaceRoot.endsWith('/')
    ? normalizedWorkspaceRoot.slice(0, -1)
    : normalizedWorkspaceRoot;

  // Use pathLib.relative for robust relative path calculation
  let relativePath = pathLib.relative(cleanWorkspaceRoot, normalizedFilePath);

  // Ensure relative path uses forward slashes (path.relative might use backslashes on Windows)
  relativePath = relativePath.replace(/\\/g, '/');

  // Always include the project directory (do not strip any prefix)
  // Optional: Remove leading './' if present
  if (relativePath.startsWith('./')) {
    relativePath = relativePath.substring(2);
  }

  // DEBUG: Log the final relativePath
  // eslint-disable-next-line no-console
  console.log('[Traceform Babel Plugin] Final traceformId path:', relativePath);

  return relativePath;
}


// Helper function to add the data-traceform-id attribute if it doesn't exist
function addDataTraceformIdAttribute(
  path: NodePath<t.JSXOpeningElement>,
  componentName: string,
  filePath: string | undefined, // Keep filePath parameter
  state: PluginState // Add state parameter to access file opts
) {
  const attributes = path.node.attributes;
  const hasAttribute = attributes.some(
    (attr) => t.isJSXAttribute(attr) && attr.name.name === 'data-traceform-id'
  );

  // Ensure filePath is a non-empty string before proceeding
  if (!hasAttribute && typeof filePath === 'string' && filePath.length > 0) {
    // Determine workspace root from Babel state (prefer root, fallback to cwd)
    // Ensure workspaceRoot is either a string or undefined, not null.
    const potentialRoot = state.file.opts.root || state.file.opts.cwd;
    const workspaceRoot: string | undefined = potentialRoot ?? undefined; // Convert null to undefined

    const relativePath = normalizeAndMakeRelative(filePath, workspaceRoot);

    // TODO: Refactor this to use the shared utility function createTraceformId
    //       from traceform/shared/src/traceformIdUtils.ts once build setup allows.
    //       (See TASK_013.3)
    // --- Start Inlined Logic from createTraceformId ---
    const instanceIndex = 0; // Default instance index
    let traceformId = 'invalid::invalid::invalid'; // Default invalid ID

    // Basic validation (copied from shared util)
    if (relativePath && componentName) {
      // Ensure forward slashes (redundant here as normalizeAndMakeRelative does it, but safe)
      const normalizedPath = relativePath.replace(/\\/g, '/');
      traceformId = `${normalizedPath}::${componentName}::${instanceIndex}`;
    } else {
       console.warn('[Traceform Babel Plugin] Missing relativePath or componentName for ID creation');
    }
    // --- End Inlined Logic ---


    path.node.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('data-traceform-id'),
        t.stringLiteral(traceformId) // Use the constructed ID
      )
    );
  }
}

export default function injectComponentIdPlugin(): PluginObj<PluginState> {
  return {
    name: 'inject-component-id', // Plugin name for debugging and configuration
    visitor: {
      JSXOpeningElement(
        path: NodePath<t.JSXOpeningElement>,
        state: PluginState
      ) {
        // Check if this element already has the attribute (e.g., from HOC)
        const hasAttribute = path.node.attributes.some(
          (attr) => t.isJSXAttribute(attr) && attr.name.name === 'data-traceform-id'
        );
        if (hasAttribute) {
          return; // Don't overwrite existing attribute
        }

        const parentElementPath = path.parentPath;
        if (!parentElementPath.isJSXElement()) {
          // This shouldn't happen based on AST structure, but check anyway
          return;
        }

        // Check if this JSXElement is the direct child of a ReturnStatement
        // or the body of an ArrowFunctionExpression (implicit return)
        const grandParentPath = parentElementPath.parentPath;
        const greatGrandParentPath = grandParentPath?.parentPath;

        let isRootReturn = false;
        let componentPath: NodePath | null = null;

        // Check for ReturnStatement -> BlockStatement -> Function/Method
        if (grandParentPath?.isReturnStatement()) {
           const funcOrMethodPath = greatGrandParentPath?.parentPath;
           if (funcOrMethodPath?.isFunction() || funcOrMethodPath?.isClassMethod()) {
              isRootReturn = true;
              componentPath = funcOrMethodPath;
           }
        }
        // Check for Arrow Function Implicit Return -> VariableDeclarator
        else if (grandParentPath?.isArrowFunctionExpression() && grandParentPath.get('body') === parentElementPath) {
           const varDeclaratorPath = greatGrandParentPath;
           if (varDeclaratorPath?.isVariableDeclarator()) {
              isRootReturn = true;
              componentPath = grandParentPath; // The arrow function itself
           }
        }
        // Check for Parenthesized Expression -> ReturnStatement -> ...
        else if (grandParentPath?.isParenthesizedExpression() && greatGrandParentPath?.isReturnStatement()) {
           const funcOrMethodPath = greatGrandParentPath.parentPath?.parentPath;
            if (funcOrMethodPath?.isFunction() || funcOrMethodPath?.isClassMethod()) {
              isRootReturn = true;
              componentPath = funcOrMethodPath;
           }
        }
        // Check for Parenthesized Expression -> Arrow Function Implicit Return -> ...
        else if (grandParentPath?.isParenthesizedExpression() && greatGrandParentPath?.isArrowFunctionExpression() && greatGrandParentPath.get('body') === grandParentPath) {
           const varDeclaratorPath = greatGrandParentPath.parentPath;
           if (varDeclaratorPath?.isVariableDeclarator()) {
              isRootReturn = true;
              componentPath = greatGrandParentPath; // The arrow function itself
           }
        }


        if (isRootReturn && componentPath) {
          let componentName: string | null = null;
          let finalComponentPath = componentPath; // Start with the direct function/class path

          // --- Check for HOC wrappers (React.memo, React.forwardRef) ---
          const parentPath = componentPath.parentPath;
          // Check if the component function/expression is the argument of a CallExpression
          if (parentPath?.isCallExpression() && parentPath.node.arguments[0] === componentPath.node) {
            const callee = parentPath.get('callee');
            let isWrapper = false;

            // Check for React.memo or memo()
            if (callee.isMemberExpression() && t.isIdentifier(callee.node.object, { name: 'React' }) && t.isIdentifier(callee.node.property, { name: 'memo' })) {
              isWrapper = true;
            } else if (callee.isIdentifier({ name: 'memo' })) { // Assuming memo is imported directly
              isWrapper = true;
            }
            // Check for React.forwardRef or forwardRef()
            else if (callee.isMemberExpression() && t.isIdentifier(callee.node.object, { name: 'React' }) && t.isIdentifier(callee.node.property, { name: 'forwardRef' })) {
              isWrapper = true;
            } else if (callee.isIdentifier({ name: 'forwardRef' })) { // Assuming forwardRef is imported directly
              isWrapper = true;
            }

            if (isWrapper) {
              // If wrapped, the component name is likely on the VariableDeclarator holding the CallExpression
              const varDeclarator = parentPath.parentPath;
              if (varDeclarator?.isVariableDeclarator()) {
                // The VariableDeclarator is now the path representing the named component
                finalComponentPath = varDeclarator;
              }
              // Note: This might need extension for other HOC patterns or assignments
            }
          }
          // --- End HOC Check ---


          // Get name based on the final component path type
          // (could be the original function/class or the wrapper's VariableDeclarator)
          if (finalComponentPath.isFunctionDeclaration() || finalComponentPath.isFunctionExpression()) {
             componentName = finalComponentPath.node.id ? finalComponentPath.node.id.name : null;
          } else if (finalComponentPath.isArrowFunctionExpression()) {
             // If it's *still* an arrow function (e.g., not wrapped or wrapper wasn't assigned to var), check its parent VariableDeclarator
             const varDeclarator = finalComponentPath.parentPath;
             if (varDeclarator?.isVariableDeclarator()) {
                const idNode = varDeclarator.node.id;
                componentName = t.isIdentifier(idNode) ? idNode.name : null;
             }
          } else if (finalComponentPath.isVariableDeclarator()) { // Handle case where wrapper was found and assigned
             const idNode = finalComponentPath.node.id;
             componentName = t.isIdentifier(idNode) ? idNode.name : null;
          } else if (finalComponentPath.isClassMethod()) { // Check if it's the render method of a class
             if (t.isIdentifier(finalComponentPath.node.key) && finalComponentPath.node.key.name === 'render') {
                const classPath = finalComponentPath.parentPath.parentPath;
                if (classPath?.isClassDeclaration() || classPath?.isClassExpression()) {
                   componentName = classPath.node.id ? classPath.node.id.name : null;
                }
             }
          }

          // Final checks and injection
          // Get the file path from state
          const filePath = state.file.opts.filename;
          // Ensure componentName and filePath are valid strings before injecting
          if (componentName && /^[A-Z]/.test(componentName) && filePath) {
            // Pass state to the helper function
            addDataTraceformIdAttribute(path, componentName, filePath, state);
          }
        } // End of if (isRootReturn && componentPath)
      },
    },
  }; // Semicolon added
}
