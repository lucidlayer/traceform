import * as vscode from 'vscode';
import { initializeClient, connectWebSocketClient, sendHighlightCommand, disconnectWebSocketClient } from './client';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Activating Code-to-UI Mapper extension...');

	// Initialize and connect the WebSocket client
	initializeClient(context); // Sets up status bar, registers disconnect cleanup
	connectWebSocketClient(); // Initial connection attempt

	// Register the command defined in package.json
	const findInUICommand = vscode.commands.registerCommand('code-to-ui-mapper.findInUI', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor found.');
			return;
		}

		const selection = editor.selection;
		let componentName: string | null = null;

		if (!selection.isEmpty) {
			componentName = editor.document.getText(selection).trim();
		} else {
			// TODO: Implement logic to infer component name from cursor position
			vscode.window.showWarningMessage('Please select a component name to find.');
			return; // Require selection for now
		}

		if (!componentName || !/^[A-Z][a-zA-Z0-9_]*$/.test(componentName)) {
			vscode.window.showWarningMessage(`"${componentName}" doesn't look like a valid component name.`);
			return;
		}

		// Send the command via the WebSocket client
		const success = sendHighlightCommand(componentName);

		// Provide feedback based on whether the command was sent
		if (success) {
			vscode.window.setStatusBarMessage(`CodeUI: Sent highlight command for ${componentName}`, 3000); // Temporary status bar message
		} else {
			// Warning message is already shown by sendHighlightCommand if connection failed
			// Optionally add another message here if needed
		}
	});

	context.subscriptions.push(findInUICommand);

	console.log('Code-to-UI Mapper extension activated.');
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Deactivating Code-to-UI Mapper extension...');
  disconnectWebSocketClient(); // Ensure WebSocket is closed
  console.log('Code-to-UI Mapper extension deactivated.');
}
