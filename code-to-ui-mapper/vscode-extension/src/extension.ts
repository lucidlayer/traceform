import * as vscode from 'vscode';
import { initializeClient, connectWebSocketClient, sendHighlightCommand, disconnectWebSocketClient } from './client';
import { startBridgeServer, stopBridgeServer } from './bridgeServer';
import { BridgeServerStatusProvider } from './sidebarProvider'; // Import the sidebar provider

// Create an output channel specifically for this extension
const outputChannel = vscode.window.createOutputChannel("Code-to-UI-Mapper");
let bridgeServerProvider: BridgeServerStatusProvider; // Hold reference to provider

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) { // Make activate async
	outputChannel.appendLine('Activating Code-to-UI Mapper extension...');

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
		vscode.window.showErrorMessage(`Code-to-UI Mapper failed to start: ${errorMessage}`);
		// Don't register command if server failed to start
		return;
	}

	// --- Register Sidebar ---
	bridgeServerProvider = new BridgeServerStatusProvider(context);
	vscode.window.registerTreeDataProvider('codeMapperBridgeStatus', bridgeServerProvider);
	outputChannel.appendLine('Bridge Server Status sidebar view registered.');
	// --- End Register Sidebar ---


	// --- Register Commands ---
	// Existing command
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
		const success = sendHighlightCommand(componentName); // Client logs internally now

		// Provide feedback based on whether the command was sent
		if (success) {
			vscode.window.setStatusBarMessage(`CodeUI: Sent highlight command for ${componentName}`, 3000); // Temporary status bar message
		} else {
			// Warning message is already shown by sendHighlightCommand if connection failed
			// Optionally add another message here if needed
		}
	});

	// New server control commands
	const startServerCommand = vscode.commands.registerCommand('code-mapper.startServer', async () => {
		outputChannel.appendLine('Command: Start Server triggered.');
		try {
			await startBridgeServer(outputChannel);
			// Optionally connect client if not already connected? Depends on desired flow.
			// connectWebSocketClient(); // Reconnect client if needed after manual start
		} catch (error) {
			// Error is already logged and shown by startBridgeServer
		}
		// Refresh sidebar explicitly after command attempt
		bridgeServerProvider?.refresh();
	});

	const stopServerCommand = vscode.commands.registerCommand('code-mapper.stopServer', async () => {
		outputChannel.appendLine('Command: Stop Server triggered.');
		// Disconnect client first? Or let stop server handle client termination?
		// disconnectWebSocketClient(); // Disconnect client before stopping server
		await stopBridgeServer(outputChannel);
		// Refresh sidebar explicitly after command attempt
		bridgeServerProvider?.refresh();
	});

	const restartServerCommand = vscode.commands.registerCommand('code-mapper.restartServer', async () => {
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
		// Refresh sidebar explicitly after command attempt
		bridgeServerProvider?.refresh();
	});


	context.subscriptions.push(
		findInUICommand,
		startServerCommand,
		stopServerCommand,
		restartServerCommand
	);
	// --- End Register Commands ---

	outputChannel.appendLine('Code-to-UI Mapper extension activated.');
}

// This method is called when your extension is deactivated
export async function deactivate() { // Make deactivate async
  outputChannel.appendLine('Deactivating Code-to-UI Mapper extension...');
  // Ensure WebSocket client is closed first
  disconnectWebSocketClient(); // Client logs internally now
  // Stop the integrated bridge server
  await stopBridgeServer(outputChannel); // Pass channel for logging
  outputChannel.appendLine('Code-to-UI Mapper extension deactivated.');
  // Dispose the channel itself? Usually not necessary, VS Code handles it.
  // outputChannel.dispose();
}
