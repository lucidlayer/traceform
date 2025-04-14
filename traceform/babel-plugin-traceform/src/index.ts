import { PluginObj, PluginPass, NodePath } from '@babel/core';
import * as t from '@babel/types'; // Import babel types
import pathLib from 'path'; // Import path library for normalization
import fs from 'fs'; // Import fs for checking root markers

// Define state if needed for the visitor
interface PluginState extends PluginPass {
  // Add any state properties needed during traversal
}

// Helper to find the workspace root (monorepo or project) by looking for common markers
function findWorkspaceRoot(startPath: string): string {
    let currentPath = pathLib.resolve(startPath);
    // Limit search depth to avoid infinite loops in weird setups
    for (let i = 0; i < 20; i++) { // Limit search depth
        // Check for common monorepo markers
        if (fs.existsSync(pathLib.join(currentPath, 'lerna.json')) ||
            fs.existsSync(pathLib.join(currentPath, 'pnpm-workspace.yaml')) ||
            fs.existsSync(pathLib.join(currentPath, 'nx.json'))) {
            // eslint-disable-next-line no-console
            console.log(`[Traceform Babel Plugin] Found monorepo marker at: ${currentPath}`);
            return currentPath;
        }
        // Check for package.json with workspaces field
        const pkgPath = pathLib.join(currentPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                if (pkg.workspaces) {
                    // eslint-disable-next-line no-console
                    console.log(`[Traceform Babel Plugin] Found workspaces package.json at: ${currentPath}`);
                    return currentPath;
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn(`[Traceform Babel Plugin] Error parsing package.json at ${pkgPath}:`, e);
             }
        }
        // Check for git root as a fallback boundary
        if (fs.existsSync(pathLib.join(currentPath, '.git'))) {
             // eslint-disable-next-line no-console
             console.log(`[Traceform Babel Plugin] Found .git boundary at: ${currentPath}`);
             return currentPath; // Use git root if found
        }

        const parentPath = pathLib.dirname(currentPath);
        if (parentPath === currentPath) {
            // Reached the filesystem root
            // eslint-disable-next-line no-console
            console.log(`[Traceform Babel Plugin] Reached filesystem root, stopping search.`);
            break;
        }
        currentPath = parentPath;
    }
    // Fallback to the starting path if no markers found within depth limit
    const fallbackRoot = pathLib.resolve(startPath);
    // eslint-disable-next-line no-console
    console.log(`[Traceform Babel Plugin] No workspace markers found, falling back to start path: ${fallbackRoot}`);
    return fallbackRoot;
}


/**
 * Helper function to normalize path and make it workspace-relative.
 * It tries to find the monorepo/project root and calculates the path relative to that.
 */
function normalizeAndMakeRelative(filePath: string, babelRoot: string | undefined): string {
    const absoluteFilePath = pathLib.resolve(filePath);
    // Use babelRoot (state.file.opts.root or cwd) as the starting point for finding the *true* workspace root
    const startSearchPath = babelRoot || process.cwd();
    const workspaceRoot = findWorkspaceRoot(startSearchPath);

    // eslint-disable-next-line no-console
    // console.log(`[Traceform Babel Plugin] File: ${absoluteFilePath}, Babel Root: ${babelRoot}, Found Workspace Root: ${workspaceRoot}`);

    let relativePath = pathLib.relative(workspaceRoot, absoluteFilePath);

    // Ensure forward slashes
    relativePath = relativePath.replace(/\\/g, '/');

    // Optional: Remove leading './' if present (path.relative usually doesn't add it unless same dir)
    if (relativePath.startsWith('./')) {
        relativePath = relativePath.substring(2);
    }

     // Ensure the path isn't empty if file is in root (e.g., workspaceRoot/file.tsx)
     if (!relativePath && absoluteFilePath.startsWith(workspaceRoot)) {
        relativePath = pathLib.basename(absoluteFilePath);
     }

    // eslint-disable-next-line no-console
    // console.log('[Traceform Babel Plugin] Final traceformId path:', relativePath);

    return relativePath;
}


/**
 * Generates a traceformId string for a component.
 * This is a simplified version, now self-contained in the plugin.
 */
function createTraceformId(relativePath: string, componentName: string, index: number): string {
  // Example: "src/components/Button.tsx:Button:0"
  return `${relativePath}:${componentName}:${index}`;
}

// Helper function to add the data-traceform-id attribute if it doesn't exist
function addDataTraceformIdAttribute(
  path: NodePath<t.JSXOpeningElement>,
  componentName: string,
  filePath: string | undefined,
  state: PluginState
) {
  const attributes = path.node.attributes;
  const hasAttribute = attributes.some(
    (attr) => t.isJSXAttribute(attr) && attr.name.name === 'data-traceform-id'
  );

  if (!hasAttribute && typeof filePath === 'string' && filePath.length > 0) {
    const potentialRoot = state.file.opts.root || state.file.opts.cwd;
    const babelRoot: string | undefined = potentialRoot ?? undefined;
    const relativePath = normalizeAndMakeRelative(filePath, babelRoot);

    // Use the shared utility to generate the traceformId
    const traceformId = createTraceformId(relativePath, componentName, 0);

    path.node.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('data-traceform-id'),
        t.stringLiteral(traceformId)
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
