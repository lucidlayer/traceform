import * as vscode from 'vscode';
import {
  getServerStatus,
  bridgeServerStatusEmitter,
  ServerStatus,
  getLogs, // Import log getter
  bridgeServerLogEmitter // Import log emitter
} from './bridgeServer'; // Import status and log related items

// Define the type for messages sent TO the webview
type WebviewMessage =
  | { type: 'updateStatus'; status: ServerStatus }
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
    webviewView.webview.onDidReceiveMessage(async (data: ExtensionMessage) => {
      switch (data.type) {
        case 'startServer': {
          vscode.commands.executeCommand('code-mapper.startServer');
          break;
        }
        case 'stopServer': {
          vscode.commands.executeCommand('code-mapper.stopServer');
          break;
        }
        case 'restartServer': {
          vscode.commands.executeCommand('code-mapper.restartServer');
          break;
        }
        case 'clearLogs': {
          // Although logs are cleared in webview, we could potentially clear the server buffer too if needed
          // For now, just acknowledge or do nothing on the extension side
          break;
        }
        case 'getInitialState': {
          // Send initial status and logs when webview requests it
          this.updateStatusDisplay(getServerStatus());
          this.sendInitialLogs();
          break;
        }
      }
    });

    // --- Event Listeners ---
    // Listen for status changes from the bridge server
    bridgeServerStatusEmitter.on('statusChange', (status: ServerStatus) => {
      console.log('[SidebarProvider] Received status change:', status); // For debugging
      this.updateStatusDisplay(status);
    });

    // Listen for new log messages from the bridge server
    bridgeServerLogEmitter.on('newLog', (logEntry: string) => {
      this.sendLogMessage(logEntry);
    });

    // Optional: Handle view disposal
    webviewView.onDidDispose(() => {
      // Clean up listeners if necessary, though emitters might handle this
      // bridgeServerStatusEmitter.off('statusChange', ...); // Need to store listener reference
      // bridgeServerLogEmitter.off('newLog', ...); // Need to store listener reference
      this._view = undefined;
    });

    // Send initial state once the webview is ready (it will post 'getInitialState')
  }

  // --- Methods to Send Data to Webview ---

  private updateStatusDisplay(status: ServerStatus) {
    if (this._view) {
      this._view.webview.postMessage({ type: 'updateStatus', status: status } as WebviewMessage);
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
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    // const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
    // const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css')); // If you add custom styles

    // Use a nonce to only allow a specific script run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
          Note: 'default-src' none; is important for security.
          'img-src' allows icons.
          'script-src' allows inline script with nonce.
          'style-src' allows inline styles and external CSS files.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<title>Code Mapper Status</title>
        <style>
          body {
            padding: 5px 10px;
            font-family: var(--vscode-font-family);
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-sideBar-background);
          }
          .status-line {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          .status-icon {
            margin-right: 8px;
            font-size: 16px; /* Adjust icon size if needed */
            width: 16px;
            height: 16px;
            display: inline-block; /* For Codicons */
          }
          .status-text {
            font-weight: bold;
          }
          .button-group {
            display: flex;
            gap: 5px; /* Spacing between buttons */
            margin-bottom: 15px;
          }
          button {
            /* Inherit VS Code button styles */
            color: var(--vscode-button-foreground);
            background-color: var(--vscode-button-background);
            border: 1px solid var(--vscode-button-border, transparent);
            padding: 4px 8px;
            cursor: pointer;
            text-align: center;
            font-size: var(--vscode-font-size);
          }
          button:hover {
            background-color: var(--vscode-button-hoverBackground);
          }
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          details {
            margin-top: 15px;
            border: 1px solid var(--vscode-editorWidget-border);
            border-radius: 3px;
            background-color: var(--vscode-editorWidget-background);
          }
          summary {
            padding: 5px;
            cursor: pointer;
            background-color: var(--vscode-sideBarSectionHeader-background);
            border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
            font-weight: bold;
          }
          .log-container {
            padding: 5px;
          }
          #log-output {
            width: 100%;
            height: 200px; /* Adjust height as needed */
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            box-sizing: border-box; /* Include padding and border in element's total width and height */
            resize: vertical; /* Allow vertical resizing */
            white-space: pre-wrap; /* Preserve whitespace and wrap lines */
            word-wrap: break-word; /* Break long words */
          }
          #clear-logs {
            margin-top: 5px;
          }
        </style>
			</head>
			<body>
				<h2>Bridge Server</h2>

        <div class="status-line">
          <span id="status-icon" class="status-icon codicon"></span>
          <span id="status-text" class="status-text">Status: Initializing...</span>
        </div>

        <div class="button-group">
          <button id="start-button" disabled>Start</button>
          <button id="stop-button" disabled>Stop</button>
          <button id="restart-button" disabled>Restart</button>
        </div>

        <details>
          <summary>Logs</summary>
          <div class="log-container">
            <textarea id="log-output" readonly></textarea>
            <button id="clear-logs">Clear Logs</button>
          </div>
        </details>

				<script nonce="${nonce}">
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
          function updateUI(status) {
            let iconClass = 'codicon-question';
            let statusText = 'Status: Unknown';
            let startEnabled = false;
            let stopEnabled = false;
            let restartEnabled = false;

            switch (status) {
              case 'running':
                iconClass = 'codicon-check'; // Use Codicon class names
                statusText = 'Status: Running';
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
                statusText = \`Status: \${status}\`;
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
                updateUI(message.status);
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
