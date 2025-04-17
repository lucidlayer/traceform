import chalk from 'chalk';

// Note: Programmatically checking VS Code extension installation is complex
// and not reliable across different environments/setups.
// We will guide the user instead.

export async function checkVSCodeExtension(): Promise<boolean> {
  console.log('Checking VS Code Extension setup...');

  console.log(chalk.yellow('Action Required: Please ensure the "Traceform" VS Code extension is installed and enabled.'));
  console.log('  1. Open VS Code.');
  console.log('  2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X).');
  console.log('  3. Search for "Traceform" by "lucidlayer".');
  console.log('  4. If not installed, click "Install".');
  console.log('  5. If installed but disabled, click "Enable".');
  console.log(chalk.cyan('  Marketplace Link: https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode'));

  // Since we can't reliably check automatically, we assume the user will follow instructions.
  // In a more interactive CLI, we could ask the user to confirm.
  console.log(chalk.green('\nPlease verify the extension is installed manually. Assuming OK for now.'));

  return true; // Return true to allow the check process to continue
}
