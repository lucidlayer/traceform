import chalk from 'chalk';
import inquirer from 'inquirer';

// Note: Programmatically checking browser extension installation is not feasible.
// We will guide the user through the manual installation process.

export async function checkBrowserExtension(): Promise<boolean> {
  console.log(chalk.yellow('Action Required: Please install the Traceform browser extension manually.'));
  console.log('  1. Download the latest `traceform-browser-extension.zip` from GitHub Releases:');
  console.log(chalk.cyan('     https://github.com/lucidlayer/traceform/releases'));
  console.log('  2. Unzip the downloaded file into a permanent location on your computer.');
  console.log('  3. Open your Chromium-based browser (Chrome, Edge, Brave, etc.).');
  console.log('  4. Navigate to the extensions page:');
  console.log(chalk.cyan('     - Chrome: chrome://extensions'));
  console.log(chalk.cyan('     - Edge: edge://extensions'));
  console.log('  5. Enable "Developer mode" (usually a toggle in the top-right corner).');
  console.log('  6. Click the "Load unpacked" button.');
  console.log('  7. Select the directory where you unzipped the extension files.');
  console.log('  8. Ensure the "Traceform" extension appears in your list and is enabled.');
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
