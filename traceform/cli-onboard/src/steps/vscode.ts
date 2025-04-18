import chalk from 'chalk';
import inquirer from 'inquirer';

// Note: Programmatically checking VS Code extension installation is complex
// and not reliable across different environments/setups.
// We will guide the user instead.

export async function checkVSCodeExtension(): Promise<boolean> {
  console.log(chalk.yellow('\nNext step: Ensure the "Traceform" VS Code extension is installed and enabled.'));
  console.log(chalk.cyan('  Marketplace Link: https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode'));
  console.log(''); // Add spacing

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Have you installed and enabled the Traceform VS Code extension?',
      default: false, // Default to no, requiring explicit confirmation
    },
  ]);

  if (confirmed) {
    console.log(chalk.green('  VS Code Extension step confirmed.'));
  } else {
    console.log(chalk.yellow('  Please install/enable the VS Code extension and run the check again.'));
  }

  return confirmed;
}
