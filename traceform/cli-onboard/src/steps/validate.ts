import chalk from 'chalk';
import inquirer from 'inquirer';

// This step guides the user through a manual validation process.

export async function runValidation(): Promise<void> {
  console.log(chalk.bold('Guiding you through the final validation process...'));

  console.log(chalk.yellow('\nAction Required: Please follow these steps to validate your Traceform setup:'));
  console.log('  1. Ensure your React development server is running.');
  console.log('     (e.g., `npm run dev`, `yarn dev`, `pnpm dev`)');
  console.log('  2. Open your project folder in VS Code.');
  console.log('  3. Open your running application in the browser where you installed the Traceform extension.');
  console.log('     (Make sure the extension is enabled!)');
  console.log('  4. In VS Code, open a file containing a React component definition.');
  console.log('     (e.g., `src/components/Button.tsx`)');
  console.log('  5. Right-click on the component name (e.g., `Button`).');
  console.log('  6. Select "Traceform: Find Component in UI" from the context menu.');
  console.log(chalk.yellow('  7. Check your browser. Did the instances of that component get highlighted?'));
  console.log(''); // Add spacing

  const { worked } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'worked',
      message: 'Did the component highlighting work correctly in the browser?',
      default: false,
    },
  ]);

  if (worked) {
    console.log(chalk.green.bold('\n🎉 Congratulations! Your Traceform setup is working correctly!'));
  } else {
    console.log(chalk.red.bold('\n❌ Validation failed.'));
    console.log(chalk.cyan('  Troubleshooting Tips:'));
    console.log(chalk.cyan('  - Double-check all previous setup steps (VS Code ext enabled, Babel plugin config correct, Browser ext enabled).'));
    console.log(chalk.cyan('  - Ensure the Babel plugin is active in your DEV build (check terminal output).'));
    console.log(chalk.cyan('  - Check the VS Code Traceform sidebar for connection status/errors.'));
    console.log(chalk.cyan('  - Check the browser extension\'s service worker status (see `chrome://extensions`).'));
    console.log(chalk.cyan('  - Consult the troubleshooting sections in the README files.'));
    console.log(chalk.cyan('  - Try restarting VS Code and your browser.'));
  }
}
