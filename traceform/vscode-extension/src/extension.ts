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
	const findInUICommand = vscode.commands.registerCommand('traceform.findInUI', async () => { // Make async for potential source map loading
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor found.');
			return;
		}

		const document = editor.document;
		const selection = editor.selection;
		const sourceFilePath = document.uri.fsPath; // Get the full file path
		const position = selection.active; // Get cursor/selection position (line, character)

		// TODO: Implement robust component name inference if selection is empty
		let selectedText: string | null = null;
		if (!selection.isEmpty) {
			selectedText = document.getText(selection).trim();
		} else {
			// Basic inference attempt (can be improved)
			const range = document.getWordRangeAtPosition(position, /[A-Z][a-zA-Z0-9_]*/);
			if (range) {
				selectedText = document.getText(range);
			} else {
				vscode.window.showWarningMessage('Could not infer component name. Please select it.');
				return;
			}
		}

		// Relaxed check: Ensure some text was selected/inferred
		if (!selectedText) {
			vscode.window.showWarningMessage(`Could not identify component name from selection/cursor.`);
			return;
		}

		// --- Placeholder for Source Map Logic ---
		// 1. Find the relevant build output directory (e.g., 'example-project-test/dist/assets')
		// 2. Find the correct .js.map file associated with `sourceFilePath`.
		// 3. Load and parse the source map (e.g., using 'source-map-js').
		// 4. Use the source map to find the generated location for `sourceFilePath` at `position`.
		// 5. Determine the `traceformId` associated with that generated location (this requires understanding how Babel output maps to source map entries).
		// -----------------------------------------

		// For now, construct the ID using the available info
		// TODO: Replace this with actual source map lookup for Browser->VSCode flow
		const componentName = selectedText; // Use the identified name

		// --- Robust Relative Path Calculation (similar to Babel plugin) ---
		let relativeSourcePath = sourceFilePath.replace(/\\/g, '/'); // Normalize slashes first
		const workspaceFolders = vscode.workspace.workspaceFolders;
		let projectRoot: string | undefined = undefined;

		if (workspaceFolders && workspaceFolders.length > 0) {
			// Find the workspace folder containing the current file
			const containingFolder = workspaceFolders.find(folder =>
				relativeSourcePath.startsWith(folder.uri.fsPath.replace(/\\/g, '/')) // Use relativeSourcePath
			);
			if (containingFolder) {
				projectRoot = containingFolder.uri.fsPath.replace(/\\/g, '/');
				// Ensure projectRoot doesn't have a trailing slash
				const cleanProjectRoot = projectRoot.endsWith('/') ? projectRoot.slice(0, -1) : projectRoot;
				// Calculate relative path using Node.js path logic (requires 'path' import)
				// Note: VS Code extensions run in Node.js, so 'path' is available
				const pathLib = require('path');
				relativeSourcePath = pathLib.relative(cleanProjectRoot, relativeSourcePath).replace(/\\/g, '/'); // Use relativeSourcePath
				// Remove leading './' if present
				if (relativeSourcePath.startsWith('./')) {
					relativeSourcePath = relativeSourcePath.substring(2);
				}
			} else {
				outputChannel.appendLine(`[Traceform VSCode] Warning: Could not determine workspace root for path: ${relativeSourcePath}. Using potentially incorrect relative path.`); // Use relativeSourcePath
				// Fallback: Attempt basic /src/ removal as before, or just use normalized path
				relativeSourcePath = relativeSourcePath.includes('/src/') // Use relativeSourcePath
					? relativeSourcePath.substring(relativeSourcePath.indexOf('/src/') + 1) // Use relativeSourcePath
					: relativeSourcePath; // Use relativeSourcePath
			}
		} else {
			outputChannel.appendLine('[Traceform VSCode] Warning: No workspace folder found. Using potentially incorrect relative path.');
			// Fallback: Attempt basic /src/ removal as before, or just use normalized path
			relativeSourcePath = relativeSourcePath.includes('/src/') // Use relativeSourcePath
				? relativeSourcePath.substring(relativeSourcePath.indexOf('/src/') + 1) // Use relativeSourcePath
				: relativeSourcePath; // Use relativeSourcePath
		}
		// --- End Relative Path Calculation ---

		// TODO: Refactor this to use the shared utility function createTraceformId
		//       from traceform/shared/src/traceformIdUtils.ts once build setup allows.
		//       (See TASK_013.3)
		// --- Start Inlined Logic from createTraceformId ---
		const instanceIndex = 0; // Default instance index
		let traceformId = 'invalid::invalid::invalid'; // Default invalid ID

		// Basic validation (copied from shared util)
		if (relativeSourcePath && componentName) {
			// Ensure forward slashes (redundant here, but safe)
			const normalizedPath = relativeSourcePath.replace(/\\/g, '/');
			traceformId = `${normalizedPath}::${componentName}::${instanceIndex}`;
		} else {
			outputChannel.appendLine(`[Traceform VSCode] Warning: Missing relativePath ('${relativeSourcePath}') or componentName ('${componentName}') for ID creation`);
		}
		// --- End Inlined Logic ---

		outputChannel.appendLine(`Source Location: ${relativeSourcePath}:${position.line + 1}:${position.character + 1}`);
		outputChannel.appendLine(`Attempting to find UI for ID: ${traceformId}`);


		// Send the command via the WebSocket client with the constructed ID
		const success = sendHighlightCommand(traceformId); // Pass the constructed ID

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
