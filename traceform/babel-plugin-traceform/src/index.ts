/*
// SPDX-License-Identifier: MIT
*/

import { PluginObj, PluginPass, NodePath } from '@babel/core';
import * as t from '@babel/types'; // Import babel types
import pathLib from 'path'; // Import path library for normalization
import fs from 'fs'; // Import fs for checking root markers
import { createTraceformError, handleTraceformError } from '../../../shared/src/traceformError';

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
        try {
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
                    // Use TraceformError for package.json parse error
                    const err = createTraceformError(
                        'TF-BP-001',
                        `[Babel Plugin] Error parsing package.json at ${pkgPath}`,
                        e,
                        'babelPlugin.packageJson.parse.error',
                        false // not critical for telemetry
                    );
                    handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
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
        } catch (fsError) {
            // Use TraceformError for file system error
            const err = createTraceformError(
                'TF-BP-002',
                `[Babel Plugin] File system error during workspace root search at ${currentPath}`,
                fsError,
                'babelPlugin.fs.error',
                true // telemetry
            );
            handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
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

// Helper function to find the component name, handling HOCs
function getComponentName(componentPath: NodePath): string | null {
    let currentPath = componentPath;
    let componentName: string | null = null;

    // Check for HOC wrappers like React.memo, React.forwardRef
    const parentPath = currentPath.parentPath;
    if (parentPath?.isCallExpression() && parentPath.node.arguments[0] === currentPath.node) {
        const callee = parentPath.get('callee');
        let isWrapper = false;
        // Check for React.memo or memo()
        if (callee.isMemberExpression() && t.isIdentifier(callee.node.object, { name: 'React' }) && t.isIdentifier(callee.node.property, { name: 'memo' })) {
            isWrapper = true;
        } else if (callee.isIdentifier({ name: 'memo' })) {
            isWrapper = true;
        }
        // Check for React.forwardRef or forwardRef()
        else if (callee.isMemberExpression() && t.isIdentifier(callee.node.object, { name: 'React' }) && t.isIdentifier(callee.node.property, { name: 'forwardRef' })) {
            isWrapper = true;
        } else if (callee.isIdentifier({ name: 'forwardRef' })) {
            isWrapper = true;
        }

        if (isWrapper) {
            // If wrapped, the name is likely on the VariableDeclarator holding the CallExpression
            const varDeclarator = parentPath.parentPath;
            if (varDeclarator?.isVariableDeclarator() && t.isIdentifier(varDeclarator.node.id)) {
                return varDeclarator.node.id.name;
            }
            // If assigned directly, e.g. export default memo(...)
             if (parentPath.parentPath?.isExportDefaultDeclaration()) {
                 // Cannot reliably get name here, might need filename heuristic
                 return null; // Or a default name like 'DefaultExportedComponent'
             }
        }
    }

    // Get name based on the original component path type
    if (currentPath.isFunctionDeclaration() || currentPath.isFunctionExpression()) {
        componentName = currentPath.node.id ? currentPath.node.id.name : null;
    } else if (currentPath.isArrowFunctionExpression()) {
        const varDeclarator = currentPath.parentPath;
        if (varDeclarator?.isVariableDeclarator() && t.isIdentifier(varDeclarator.node.id)) {
            componentName = varDeclarator.node.id.name;
        }
    } else if (currentPath.isClassDeclaration() || currentPath.isClassExpression()) {
        componentName = currentPath.node.id ? currentPath.node.id.name : null;
    }

    // Basic check if it looks like a component name (starts with uppercase)
    if (componentName && /^[A-Z]/.test(componentName)) {
        return componentName;
    }

    return null;
}


// Helper function to find the first JSXElement within a node or its children
function findFirstJSXElement(nodePath: NodePath): NodePath<t.JSXOpeningElement> | null {
    let targetElementPath: NodePath<t.JSXOpeningElement> | null = null;

    if (nodePath.isJSXElement()) {
        targetElementPath = nodePath.get('openingElement');
    } else if (nodePath.isJSXFragment()) {
        const children = nodePath.get('children');
        for (const child of children) {
            if (child.isJSXElement()) {
                targetElementPath = child.get('openingElement');
                break; // Found the first one
            }
            // Potentially look deeper? For now, only direct children.
        }
    } else if (nodePath.isParenthesizedExpression()) {
        // Look inside parentheses, e.g., return (<div />)
        return findFirstJSXElement(nodePath.get('expression'));
    }
    // Add checks for other potential wrapper nodes if necessary

    // Check if the found element already has the attribute
    if (targetElementPath) {
        const hasAttribute = targetElementPath.node.attributes.some(
            (attr) => t.isJSXAttribute(attr) && attr.name.name === 'data-traceform-id'
        );
        if (hasAttribute) {
            return null; // Don't target if attribute already exists
        }
    }


    return targetElementPath;
}


// The main plugin function
export default function injectComponentIdPlugin(): PluginObj<PluginState> {
  return {
    name: 'inject-traceform-id', // Updated plugin name
    visitor: {
      // Visit component definitions directly
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>, state: PluginState) {
        const componentName = getComponentName(path);
        if (!componentName) {
          // Use TraceformError for missing/invalid component name
          const err = createTraceformError(
            'TF-BP-010',
            '[Babel Plugin] Could not determine component name in FunctionDeclaration',
            { file: state.file?.opts?.filename },
            'babelPlugin.componentName.missing',
            false
          );
          handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
          return;
        }
        // Find the return statement within the function body
        path.get('body').traverse({
          ReturnStatement(returnPath: NodePath<t.ReturnStatement>) {
            const argumentPath = returnPath.get('argument');
            if (!argumentPath.node) {
              // Use TraceformError for missing return argument
              const err = createTraceformError(
                'TF-BP-011',
                '[Babel Plugin] No return argument found in component',
                { componentName, file: state.file?.opts?.filename },
                'babelPlugin.returnArgument.missing',
                false
              );
              handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
              return;
            }
            const validArgumentPath = argumentPath as NodePath<t.Node>;
            const targetElementPath = findFirstJSXElement(validArgumentPath);
            if (targetElementPath) {
              const filePath = state.file.opts.filename;
              if (typeof filePath !== 'string' || !filePath.length) {
                // Use TraceformError for missing/invalid file path
                const err = createTraceformError(
                  'TF-BP-012',
                  '[Babel Plugin] Invalid or missing file path for component',
                  { componentName, filePath },
                  'babelPlugin.filePath.invalid',
                  true
                );
                handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
                return;
              }
              try {
                addDataTraceformIdAttribute(targetElementPath, componentName, filePath, state);
                returnPath.stop();
              } catch (e) {
                // Use TraceformError for attribute injection failure
                const err = createTraceformError(
                  'TF-BP-013',
                  '[Babel Plugin] Failed to inject data-traceform-id attribute',
                  { componentName, filePath, error: e },
                  'babelPlugin.attributeInjection.failed',
                  true
                );
                handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
              }
            } else {
              // Use TraceformError for missing JSX element
              const err = createTraceformError(
                'TF-BP-014',
                '[Babel Plugin] No JSX element found in return statement',
                { componentName, file: state.file?.opts?.filename },
                'babelPlugin.jsxElement.missing',
                false
              );
              handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
            }
          }
        });
      },

      ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>, state: PluginState) {
         const componentName = getComponentName(path);
         if (!componentName) {
           const err = createTraceformError(
             'TF-BP-020',
             '[Babel Plugin] Could not determine component name in ArrowFunctionExpression',
             { file: state.file?.opts?.filename },
             'babelPlugin.componentName.missing',
             false
           );
           handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
           return;
         }
         const body = path.get('body');
         if (!body.isBlockStatement()) {
             if (!body.node) {
               const err = createTraceformError(
                 'TF-BP-021',
                 '[Babel Plugin] No body node found in ArrowFunctionExpression',
                 { componentName, file: state.file?.opts?.filename },
                 'babelPlugin.bodyNode.missing',
                 false
               );
               handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
               return;
             }
             const validBodyPath = body as NodePath<t.Node>;
             const targetElementPath = findFirstJSXElement(validBodyPath);
             if (targetElementPath) {
               const filePath = state.file.opts.filename;
               if (typeof filePath !== 'string' || !filePath.length) {
                 const err = createTraceformError(
                   'TF-BP-022',
                   '[Babel Plugin] Invalid or missing file path for ArrowFunctionExpression',
                   { componentName, filePath },
                   'babelPlugin.filePath.invalid',
                   true
                 );
                 handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
                 return;
               }
               try {
                 addDataTraceformIdAttribute(targetElementPath, componentName, filePath, state);
               } catch (e) {
                 const err = createTraceformError(
                   'TF-BP-023',
                   '[Babel Plugin] Failed to inject data-traceform-id attribute in ArrowFunctionExpression',
                   { componentName, filePath, error: e },
                   'babelPlugin.attributeInjection.failed',
                   true
                 );
                 handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
               }
             } else {
               const err = createTraceformError(
                 'TF-BP-024',
                 '[Babel Plugin] No JSX element found in ArrowFunctionExpression body',
                 { componentName, file: state.file?.opts?.filename },
                 'babelPlugin.jsxElement.missing',
                 false
               );
               handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
             }
         } else {
            body.traverse({
               ReturnStatement(returnPath: NodePath<t.ReturnStatement>) {
                  const argumentPath = returnPath.get('argument');
                  if (!argumentPath.node) {
                    const err = createTraceformError(
                      'TF-BP-025',
                      '[Babel Plugin] No return argument found in ArrowFunctionExpression block',
                      { componentName, file: state.file?.opts?.filename },
                      'babelPlugin.returnArgument.missing',
                      false
                    );
                    handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
                    return;
                  }
                  const validArgumentPath = argumentPath as NodePath<t.Node>;
                  const targetElementPath = findFirstJSXElement(validArgumentPath);
                  if (targetElementPath) {
                    const filePath = state.file.opts.filename;
                    if (typeof filePath !== 'string' || !filePath.length) {
                      const err = createTraceformError(
                        'TF-BP-026',
                        '[Babel Plugin] Invalid or missing file path for ArrowFunctionExpression block',
                        { componentName, filePath },
                        'babelPlugin.filePath.invalid',
                        true
                      );
                      handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
                      return;
                    }
                    try {
                      addDataTraceformIdAttribute(targetElementPath, componentName, filePath, state);
                      returnPath.stop();
                    } catch (e) {
                      const err = createTraceformError(
                        'TF-BP-027',
                        '[Babel Plugin] Failed to inject data-traceform-id attribute in ArrowFunctionExpression block',
                        { componentName, filePath, error: e },
                        'babelPlugin.attributeInjection.failed',
                        true
                      );
                      handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
                    }
                  } else {
                    const err = createTraceformError(
                      'TF-BP-028',
                      '[Babel Plugin] No JSX element found in ArrowFunctionExpression block return',
                      { componentName, file: state.file?.opts?.filename },
                      'babelPlugin.jsxElement.missing',
                      false
                    );
                    handleTraceformError(err, 'BabelPlugin'); // @ErrorFeedback
                  }
               }
            });
         }
      },

      // Add visitors for FunctionExpression and ClassMethod (render) similarly if needed
      // FunctionExpression(...) { ... }
      // ClassMethod(path, state) { if (path.node.key.name === 'render') { ... } }

    },
  };
}
