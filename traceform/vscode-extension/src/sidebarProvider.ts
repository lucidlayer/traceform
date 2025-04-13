import * as vscode from 'vscode';
import {
  getServerStatus, // Ensure only one import remains
  bridgeServerStatusEmitter,
  ServerStatus,
  StatusUpdatePayload, // Import the payload type
  getLogs, // Import log getter
  bridgeServerLogEmitter // Import log emitter
} from './bridgeServer'; // Import status and log related items

// Define the type for messages sent TO the webview
type WebviewMessage =
  | { type: 'updateStatus'; payload: StatusUpdatePayload } // Use the payload type
  | { type: 'logMessage'; data: string }
  | { type: 'initialLogs'; logs: string[] };

// Define the type for messages received FROM the webview
type ExtensionMessage =
  | { type: 'startServer' }
  | { type: 'stopServer' }
  | { type: 'restartServer' }
  | { type: 'clearLogs' }
  | { type: 'getInitialState' };


export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  private _disposables: vscode.Disposable[] = [];
  private _statusListener?: (payload: StatusUpdatePayload) => void; // Expect payload
  private _logListener?: (logEntry: string) => void;

  constructor(private readonly _extensionUri: vscode.Uri) { } // Keep extension URI for resource paths

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // --- Message Handling ---
    this._disposables.push(
      webviewView.webview.onDidReceiveMessage(async (data: ExtensionMessage) => {
        switch (data.type) {
          case 'startServer': {
            vscode.commands.executeCommand('traceform.startServer');
            break;
          }
          case 'stopServer': {
            vscode.commands.executeCommand('traceform.stopServer');
            break;
          }
          case 'restartServer': {
            vscode.commands.executeCommand('traceform.restartServer');
            break;
          }
          case 'clearLogs': {
            // Although logs are cleared in webview, we could potentially clear the server buffer too if needed
            // For now, just acknowledge or do nothing on the extension side
            break;
          }
          case 'getInitialState': {
            // Send initial status and logs when webview requests it
            // Construct the initial payload
            const initialStatus = getServerStatus();
            const initialPayload: StatusUpdatePayload = { status: initialStatus };
            if (initialStatus === 'running') {
              // If already running on init, try to get port (might need adjustment in bridgeServer if port isn't stored)
              // For now, we'll assume it might not be available on initial sync, port is optional
            }
            this.updateStatusDisplay(initialPayload);
            this.sendInitialLogs();
            break;
          }
        }
      })
    );

    // --- Event Listeners ---
    // Listen for status changes from the bridge server
    this._statusListener = (payload: StatusUpdatePayload): void => { // Expect payload
      console.log('[SidebarProvider] Received status change:', payload); // For debugging
      this.updateStatusDisplay(payload); // Pass payload
    };
    bridgeServerStatusEmitter.on('statusChange', this._statusListener);

    // Listen for new log messages from the bridge server
    this._logListener = (logEntry: string): void => {
      this.sendLogMessage(logEntry);
    };
    bridgeServerLogEmitter.on('newLog', this._logListener);

    // Clean up listeners when view is disposed
    webviewView.onDidDispose(() => {
      // Clean up all VS Code disposables
      this._disposables.forEach(d => d.dispose());
      this._disposables = [];
      
      // Clean up event emitter listeners
      if (this._statusListener) {
        bridgeServerStatusEmitter.off('statusChange', this._statusListener);
        this._statusListener = undefined;
      }
      if (this._logListener) {
        bridgeServerLogEmitter.off('newLog', this._logListener);
        this._logListener = undefined;
      }
      
      this._view = undefined;
    });

    // Send initial state once the webview is ready (it will post 'getInitialState')
  }

  // --- Methods to Send Data to Webview ---

  private updateStatusDisplay(payload: StatusUpdatePayload) { // Accept payload
    if (this._view) {
      // Send the whole payload object
      this._view.webview.postMessage({ type: 'updateStatus', payload: payload } as WebviewMessage);
    }
  }

  private sendLogMessage(logEntry: string) {
    if (this._view) {
      this._view.webview.postMessage({ type: 'logMessage', data: logEntry } as WebviewMessage);
    }
  }

  private sendInitialLogs() {
     if (this._view) {
       const initialLogs = getLogs();
       this._view.webview.postMessage({ type: 'initialLogs', logs: initialLogs } as WebviewMessage);
     }
  }


  // --- HTML Generation ---

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get URIs for required resources
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
    // Get URI for the toolkit script
    const toolkitUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode', 'webview-ui-toolkit', 'dist', 'toolkit.js'));

    // Use a nonce to only allow specific scripts to run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading specific resources
				-->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}' ${webview.cspSource};">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <script type="module" src="${toolkitUri}" nonce="${nonce}"></script>
				<title>Traceform Status</title>
        <style>
          body {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 15px; /* Consistent spacing */
          }
          .status-line {
            display: flex;
            align-items: center;
            gap: 8px; /* Spacing between icon and text */
          }
          .status-icon {
             /* Codicon size is usually handled by font-size */
          }
          .status-text {
            font-weight: bold;
          }
          .button-group {
            display: flex;
            gap: 5px; /* Spacing between buttons */
          }
          vscode-text-area {
            width: 100%; /* Make text area fill width */
            box-sizing: border-box;
          }
          vscode-button {
             /* Toolkit buttons handle their own styling */
          }
          vscode-collapsible { /* Using collapsible instead of details/summary */
             width: 100%;
             margin-top: 5px; /* Add some space above logs */
          }
          .log-container {
             display: flex;
             flex-direction: column;
             gap: 5px; /* Space between textarea and clear button */
             padding-top: 10px; /* Space below collapsible title */
          }
        </style>
			</head>
			<body>
        <section class="status-line">
          <span id="status-icon" class="status-icon codicon"></span>
          <span id="status-text" class="status-text">Status: Initializing...</span>
        </section>

        <section class="button-group">
          <vscode-button id="start-button" appearance="primary" disabled>Start</vscode-button>
          <vscode-button id="stop-button" appearance="secondary" disabled>Stop</vscode-button>
          <vscode-button id="restart-button" appearance="secondary" disabled>Restart</vscode-button>
        </section>

        <section> <!-- Added section for the link -->
          <vscode-link href="#">View Documentation</vscode-link>
        </section>

        <vscode-collapsible title="Logs">
            <section class="log-container">
              <vscode-text-area id="log-output" readonly resize="vertical" rows="10"></vscode-text-area>
              <vscode-button id="clear-logs" appearance="secondary">Clear Logs</vscode-button>
            </section>
        </vscode-collapsible>

				<script nonce="${nonce}">
          // Get toolkit components
          const vscode = acquireVsCodeApi();

          const statusIconEl = document.getElementById('status-icon');
          const statusTextEl = document.getElementById('status-text');
          const startButton = document.getElementById('start-button');
          const stopButton = document.getElementById('stop-button');
          const restartButton = document.getElementById('restart-button');
          const logOutputEl = document.getElementById('log-output');
          const clearLogsButton = document.getElementById('clear-logs');

          // --- Event Listeners for UI actions ---
          startButton.addEventListener('click', () => {
            vscode.postMessage({ type: 'startServer' });
          });
          stopButton.addEventListener('click', () => {
            vscode.postMessage({ type: 'stopServer' });
          });
          restartButton.addEventListener('click', () => {
            vscode.postMessage({ type: 'restartServer' });
          });
          clearLogsButton.addEventListener('click', () => {
            logOutputEl.value = ''; // Clear the textarea
            vscode.postMessage({ type: 'clearLogs' }); // Inform extension if needed
          });

          // --- Function to update UI based on status ---
          function updateUI(payload) { // Expect payload object
            const status = payload.status; // Extract status
            const port = payload.port; // Extract port (might be undefined)

            let iconClass = 'codicon-question';
            let statusText = 'Status: Unknown';
            let startEnabled = false;
            let stopEnabled = false;
            let restartEnabled = false;

            switch (status) {
              case 'running':
                iconClass = 'codicon-check'; // Use Codicon class names
                // Display port if available - Use string concatenation
                statusText = 'Status: Running' + (port ? ' on port ' + port : '');
                stopEnabled = true;
                restartEnabled = true;
                break;
              case 'starting':
                iconClass = 'codicon-sync codicon-modifier-spin'; // Spinning icon
                statusText = 'Status: Starting...';
                break;
              case 'stopping':
                iconClass = 'codicon-sync codicon-modifier-spin';
                statusText = 'Status: Stopping...';
                break;
              case 'stopped':
                iconClass = 'codicon-debug-stop';
                statusText = 'Status: Stopped';
                startEnabled = true;
                break;
              case 'error':
                iconClass = 'codicon-error';
                statusText = 'Status: Error';
                startEnabled = true; // Allow restart attempt
                restartEnabled = true;
                break;
              case 'port-conflict':
                iconClass = 'codicon-error';
                statusText = 'Status: Port Conflict';
                startEnabled = true; // Allow restart attempt
                restartEnabled = true;
                break;
              default:
                 // Use string concatenation
                statusText = 'Status: ' + status;
            }

            statusIconEl.className = \`status-icon codicon \${iconClass}\`; // Set class for Codicon
            statusTextEl.textContent = statusText;
            startButton.disabled = !startEnabled;
            stopButton.disabled = !stopEnabled;
            restartButton.disabled = !restartEnabled;
          }

          // --- Function to append log messages ---
          function appendLog(message) {
            if (logOutputEl) {
              logOutputEl.value += message + '\\n';
              logOutputEl.scrollTop = logOutputEl.scrollHeight; // Auto-scroll to bottom
            }
          }

          // --- Listener for messages from the extension ---
          window.addEventListener('message', event => {
            const message = event.data; // The JSON data that the extension sent
            switch (message.type) {
              case 'updateStatus':
                updateUI(message.payload); // Pass the whole payload
                break;
              case 'logMessage':
                appendLog(message.data);
                break;
              case 'initialLogs':
                 logOutputEl.value = ''; // Clear first
                 message.logs.forEach(log => appendLog(log));
                 break;
            }
          });

          // --- Request initial state when the webview loads ---
          vscode.postMessage({ type: 'getInitialState' });

				</script>
			</body>
			</html>`;
  }
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
