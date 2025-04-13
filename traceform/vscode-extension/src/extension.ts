import * as vscode from 'vscode';
import { initializeClient, connectWebSocketClient, sendHighlightCommand, disconnectWebSocketClient } from './client';
import { startBridgeServer, stopBridgeServer } from './bridgeServer';
import { SidebarProvider } from './sidebarProvider'; // Import the new WebviewView provider

// Create an output channel specifically for this extension
const outputChannel = vscode.window.createOutputChannel("Traceform");
// No need to hold a global reference to the provider instance anymore for refresh

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) { // Make activate async
	outputChannel.appendLine('Activating Traceform extension...');

	try {
		// Start the integrated bridge server first, passing the channel
		await startBridgeServer(outputChannel);
		outputChannel.appendLine('Integrated bridge server started successfully.');

		// Initialize and connect the WebSocket client (which connects to the integrated server)
		initializeClient(context, outputChannel); // Pass channel to client setup
		connectWebSocketClient(); // Initial connection attempt

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		outputChannel.appendLine(`Failed to activate extension: ${errorMessage}`);
		vscode.window.showErrorMessage(`Traceform failed to start: ${errorMessage}`);
		// Don't register command if server failed to start
		return;
	}

	// --- Register Sidebar ---
	// Instantiate the new provider, passing the extension's URI for resource loading
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	// Register the provider for the 'traceformBridgeStatus' view defined in package.json
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'traceformBridgeStatus',
			sidebarProvider,
			{
				webviewOptions: {
					retainContextWhenHidden: true // Keep the webview state when hidden
				}
			}
		)
	);
	outputChannel.appendLine('Bridge Server Status sidebar webview registered.');
	// --- End Register Sidebar ---


	// --- Register Commands ---
	// Existing command
	const findInUICommand = vscode.commands.registerCommand('traceform.findInUI', () => {
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
		const success = sendHighlightCommand(componentName); // Client logs internally now

		// Provide feedback based on whether the command was sent
		if (success) {
			vscode.window.setStatusBarMessage(`Traceform: Sent highlight command for ${componentName}`, 3000); // Temporary status bar message
		} else {
			// Warning message is already shown by sendHighlightCommand if connection failed
			// Optionally add another message here if needed
		}
	});

	// New server control commands
	const startServerCommand = vscode.commands.registerCommand('traceform.startServer', async () => {
		outputChannel.appendLine('Command: Start Server triggered.');
		try {
			await startBridgeServer(outputChannel);
			// Optionally connect client if not already connected? Depends on desired flow.
			// connectWebSocketClient(); // Reconnect client if needed after manual start
		} catch (error) {
			// Error is already logged and shown by startBridgeServer
		}
		// No need to refresh sidebar, it listens for status changes reactively
	});

	const stopServerCommand = vscode.commands.registerCommand('traceform.stopServer', async () => {
		outputChannel.appendLine('Command: Stop Server triggered.');
		// Disconnect client first? Or let stop server handle client termination?
		// disconnectWebSocketClient(); // Disconnect client before stopping server
		await stopBridgeServer(outputChannel);
		// No need to refresh sidebar, it listens for status changes reactively
	});

	const restartServerCommand = vscode.commands.registerCommand('traceform.restartServer', async () => {
		outputChannel.appendLine('Command: Restart Server triggered.');
		try {
			await stopBridgeServer(outputChannel);
			// Short delay before restarting?
			await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
			await startBridgeServer(outputChannel);
			// Reconnect client after restart
			// connectWebSocketClient();
		} catch (error) {
			// Errors handled internally by start/stop
		}
		// No need to refresh sidebar, it listens for status changes reactively
	});


	context.subscriptions.push(
		findInUICommand,
		startServerCommand,
		stopServerCommand,
		restartServerCommand
	);
	// --- End Register Commands ---

	outputChannel.appendLine('Traceform extension activated.');
}

// This method is called when your extension is deactivated
export async function deactivate() { // Make deactivate async
  outputChannel.appendLine('Deactivating Traceform extension...');
  // Ensure WebSocket client is closed first
  disconnectWebSocketClient(); // Client logs internally now
  // Stop the integrated bridge server
  await stopBridgeServer(outputChannel); // Pass channel for logging
  outputChannel.appendLine('Traceform extension deactivated.');
  // Dispose the channel itself? Usually not necessary, VS Code handles it.
  // outputChannel.dispose();
}
