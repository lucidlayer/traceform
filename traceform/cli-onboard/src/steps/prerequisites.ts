import chalk from 'chalk';
import { execa } from 'execa';

async function checkCommandVersion(command: string, versionArg: string, minVersion: string): Promise<boolean> {
  try {
    const { stdout } = await execa(command, [versionArg]);
    const version = stdout.trim().replace(/^v/, ''); // Remove leading 'v' if present
    console.log(`  Found ${command} version: ${version}`);

    // Simple version comparison (assumes semantic versioning)
    const versionParts = version.split('.').map(Number);
    const minVersionParts = minVersion.split('.').map(Number);

    for (let i = 0; i < minVersionParts.length; i++) {
      if (versionParts[i] > minVersionParts[i]) return true;
      if (versionParts[i] < minVersionParts[i]) {
        console.log(chalk.red(`  Error: ${command} version ${version} is below the required minimum ${minVersion}.`));
        return false;
      }
    }
    return true; // Versions are equal or version has more parts (e.g., 18.17.1 vs 18.17.0)
  } catch (error) {
    console.log(chalk.red(`  Error: Could not find or execute '${command}'. Please ensure it's installed and in your PATH.`));
    return false;
  }
}

export async function checkPrerequisites(): Promise<boolean> {
  console.log('Checking prerequisites...');
  let passed = true;

  // Check Node.js version (min 18.17.0 based on package.json)
  console.log(chalk.yellow('Checking Node.js version...'));
  if (!await checkCommandVersion('node', '-v', '18.17.0')) {
    passed = false;
    console.log(chalk.yellow('  Please install or update Node.js from https://nodejs.org/'));
  } else {
     console.log(chalk.green('  Node.js check passed.'));
  }

  // Check for at least one package manager (npm, yarn, or pnpm)
  console.log(chalk.yellow('\nChecking for package manager (npm, yarn, or pnpm)...'));
  const npmFound = await checkCommandVersion('npm', '-v', '8.0.0'); // Example minimum, adjust if needed
  const yarnFound = await checkCommandVersion('yarn', '-v', '1.22.0'); // Example minimum
  const pnpmFound = await checkCommandVersion('pnpm', '-v', '7.0.0'); // Example minimum

  if (!npmFound && !yarnFound && !pnpmFound) {
    console.log(chalk.red('  Error: No supported package manager (npm, yarn, or pnpm) found.'));
    console.log(chalk.yellow('  Please install npm (usually comes with Node.js), yarn (https://yarnpkg.com/), or pnpm (https://pnpm.io/).'));
    passed = false;
  } else {
     console.log(chalk.green('  Package manager check passed.'));
  }


  if (!passed) {
    console.log(chalk.red('\nPrerequisite checks failed. Please address the issues above.'));
  }

  return passed;
}
