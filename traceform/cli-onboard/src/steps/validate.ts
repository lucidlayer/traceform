import chalk from 'chalk';

// This step guides the user through a manual validation process.

export async function runValidation(): Promise<void> {
  console.log('Guiding you through the validation process...');

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

  console.log(chalk.cyan('\nIf the component instances were highlighted in the browser:'));
  console.log(chalk.green.bold('  🎉 Congratulations! Your Traceform setup is working correctly!'));
  console.log(chalk.cyan('\nIf highlighting did not work:'));
  console.log(chalk.red('  - Double-check all previous setup steps (VS Code ext, Babel plugin config, Browser ext).'));
  console.log(chalk.red('  - Ensure the Babel plugin is active in your DEV build.'));
  console.log(chalk.red('  - Check the VS Code Traceform sidebar for connection status/errors.'));
  console.log(chalk.red('  - Check the browser extension\'s service worker status (see `chrome://extensions`).'));
  console.log(chalk.red('  - Consult the troubleshooting sections in the README files.'));

  // In a more interactive CLI, we could ask for confirmation.
}
