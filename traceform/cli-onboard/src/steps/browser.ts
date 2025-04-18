import chalk from 'chalk';
import inquirer from 'inquirer';

// Note: Programmatically checking browser extension installation is not feasible.
// We will guide the user through the manual installation process.

export async function checkBrowserExtension(): Promise<boolean> {
  console.log(chalk.yellow('\nNext step: Install the Traceform browser extension manually.'));
  console.log(chalk.cyan('  Download Link: https://github.com/lucidlayer/traceform/releases'));
  // TODO: Add link to detailed setup guide in README or docs
  console.log(chalk.cyan('  Detailed Guide: <Link to README/Docs section>'));
  console.log(''); // Add spacing

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Have you installed and enabled the Traceform Browser extension?',
      default: false, // Default to no, requiring explicit confirmation
    },
  ]);

  if (confirmed) {
    console.log(chalk.green('  Browser Extension step confirmed.'));
  } else {
    console.log(chalk.yellow('  Please install/enable the Browser extension and run the check again.'));
  }

  return confirmed;
}
