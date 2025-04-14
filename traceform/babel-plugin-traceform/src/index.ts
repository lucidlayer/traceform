import { PluginObj, PluginPass, NodePath } from '@babel/core';
import * as t from '@babel/types'; // Import babel types

// Define state if needed for the visitor
interface PluginState extends PluginPass {
  // Add any state properties needed during traversal
  // Add any state properties needed during traversal
}

import pathLib from 'path'; // Import path library for normalization

// Helper function to add the data-traceform-id attribute if it doesn't exist
function addDataTraceformIdAttribute(
  path: NodePath<t.JSXOpeningElement>,
  componentName: string,
  filePath: string | undefined // Add filePath parameter
) {
  const attributes = path.node.attributes;
  const hasAttribute = attributes.some(
    (attr) => t.isJSXAttribute(attr) && attr.name.name === 'data-traceform-id'
  );

  if (!hasAttribute && filePath) {
    // Construct the ID: filePath::componentName::instanceIndex (using 0 for now)
    // Normalize path separators for consistency
    const normalizedFilePath = filePath.replace(/\\/g, '/');
    // Attempt to make path relative to a potential project root (heuristic)
    const relativePath = normalizedFilePath.includes('/src/')
      ? normalizedFilePath.substring(normalizedFilePath.indexOf('/src/') + 1)
      : normalizedFilePath; // Fallback to normalized path if /src/ not found

    const traceformId = `${relativePath}::${componentName}::0`;

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

          // Get name based on component path type
          if (componentPath.isFunctionDeclaration() || componentPath.isFunctionExpression()) {
             componentName = componentPath.node.id ? componentPath.node.id.name : null;
          } else if (componentPath.isArrowFunctionExpression()) {
             const varDeclarator = componentPath.parentPath;
             if (varDeclarator?.isVariableDeclarator()) {
                const idNode = varDeclarator.node.id;
                componentName = t.isIdentifier(idNode) ? idNode.name : null;
             }
          } else if (componentPath.isClassMethod()) { // Check if it's the render method of a class
             if (t.isIdentifier(componentPath.node.key) && componentPath.node.key.name === 'render') {
                const classPath = componentPath.parentPath.parentPath;
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
            addDataTraceformIdAttribute(path, componentName, filePath);
          }
        } // End of if (isRootReturn && componentPath)
      }, // Comma added
    },
  }; // Semicolon added
}
