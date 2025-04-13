import * as vscode from 'vscode';
import { getServerStatus, bridgeServerStatusEmitter, ServerStatus } from './bridgeServer'; // Import status related items

export class BridgeServerStatusProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {
    // Listen for status changes from the bridge server and refresh the view
    bridgeServerStatusEmitter.on('statusChange', (status: ServerStatus) => {
      console.log('[SidebarProvider] Received status change:', status); // For debugging
      this.refresh();
    });
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    // Return the element itself as it already is a TreeItem
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    // If no element is provided, we are at the root
    if (!element) {
      const status = getServerStatus();
      const items: vscode.TreeItem[] = [];

      // 1. Status Item
      let statusLabel = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      let statusIcon: vscode.ThemeIcon;
      let contextValue = `server-${status}`; // Context value for actions

      switch (status) {
        case 'running':
          statusIcon = new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
          break;
        case 'starting':
        case 'stopping':
          statusIcon = new vscode.ThemeIcon('sync~spin');
          break;
        case 'stopped':
          statusIcon = new vscode.ThemeIcon('debug-stop', new vscode.ThemeColor('debugIcon.stopForeground'));
           break;
        case 'error':
        case 'port-conflict':
          statusIcon = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
          break;
        default:
          statusIcon = new vscode.ThemeIcon('question');
      }

      const statusItem = new vscode.TreeItem(statusLabel, vscode.TreeItemCollapsibleState.None);
      statusItem.iconPath = statusIcon;
      statusItem.contextValue = contextValue; // Used to show/hide commands in package.json
      statusItem.tooltip = `Bridge server status is currently: ${status}`;
      items.push(statusItem);


      // 2. Action Items (Commands) - These don't execute directly, they trigger commands
      if (status === 'stopped' || status === 'error' || status === 'port-conflict') {
        const startItem = new vscode.TreeItem('Start Server', vscode.TreeItemCollapsibleState.None);
        startItem.command = { command: 'code-mapper.startServer', title: 'Start Bridge Server' };
        startItem.iconPath = new vscode.ThemeIcon('debug-start', new vscode.ThemeColor('debugIcon.startForeground'));
        startItem.tooltip = 'Attempt to start the bridge server';
        items.push(startItem);
      }

      if (status === 'running') {
        const stopItem = new vscode.TreeItem('Stop Server', vscode.TreeItemCollapsibleState.None);
        stopItem.command = { command: 'code-mapper.stopServer', title: 'Stop Bridge Server' };
        stopItem.iconPath = new vscode.ThemeIcon('debug-stop', new vscode.ThemeColor('debugIcon.stopForeground'));
        stopItem.tooltip = 'Stop the running bridge server';
        items.push(stopItem);

        const restartItem = new vscode.TreeItem('Restart Server', vscode.TreeItemCollapsibleState.None);
        restartItem.command = { command: 'code-mapper.restartServer', title: 'Restart Bridge Server' };
        restartItem.iconPath = new vscode.ThemeIcon('debug-restart', new vscode.ThemeColor('debugIcon.restartForeground'));
        restartItem.tooltip = 'Stop and then restart the bridge server';
        items.push(restartItem);
      }

       // Always show restart if there was an error or conflict? Maybe. Let's add it.
       if (status === 'error' || status === 'port-conflict') {
         const restartItem = new vscode.TreeItem('Restart Server', vscode.TreeItemCollapsibleState.None);
         restartItem.command = { command: 'code-mapper.restartServer', title: 'Restart Bridge Server' };
         restartItem.iconPath = new vscode.ThemeIcon('debug-restart', new vscode.ThemeColor('debugIcon.restartForeground'));
         restartItem.tooltip = 'Attempt to restart the bridge server';
         items.push(restartItem);
       }


      return Promise.resolve(items);
    }

    // If an element is provided, it means we are trying to get children of a node
    // In this simple case, our nodes don't have children.
    return Promise.resolve([]);
  }
}
