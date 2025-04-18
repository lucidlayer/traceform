import chalk from 'chalk';
// Removed static execa import - will use dynamic import below

// Define the type for the verbose logger function
type VerboseLogger = (...args: any[]) => void;

async function checkCommandVersion(
  command: string,
  versionArg: string,
  minVersion: string,
  verboseLog: VerboseLogger // Add logger parameter
): Promise<boolean> {
  try {
    // Dynamically import execa here as it's an ESM module
    const { execa } = await import('execa');
    const { stdout } = await execa(command, [versionArg]);
    const version = stdout.trim().replace(/^v/, ''); // Remove leading 'v' if present
    verboseLog(`  Found ${command} version: ${version}`); // Use verboseLog

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
    // Make error message slightly friendlier
    console.log(chalk.red(`  Error: Couldn't run '${command}'. Is it installed and available in your terminal's PATH?`));
    return false;
  }
}

export async function checkPrerequisites(verboseLog: VerboseLogger): Promise<boolean> { // Add logger parameter
  verboseLog('Checking prerequisites...'); // Use verboseLog
  let passed = true;
  let packageManagerFound = false;

  // Check Node.js version (min 18.17.0 based on package.json)
  verboseLog(chalk.yellow('Checking Node.js version...')); // Use verboseLog
  if (!await checkCommandVersion('node', '-v', '18.17.0', verboseLog)) { // Pass logger
    passed = false;
    console.log(chalk.yellow('  Please install or update Node.js from https://nodejs.org/'));
  } else {
     verboseLog(chalk.green('  Node.js check passed.')); // Use verboseLog
  }

  // Check for at least one package manager (npm, yarn, or pnpm)
  verboseLog(chalk.yellow('\nChecking for package manager (npm, yarn, or pnpm)...')); // Use verboseLog

  // Check npm
  if (await checkCommandVersion('npm', '-v', '8.0.0', verboseLog)) { // Pass logger
    packageManagerFound = true;
    verboseLog(chalk.green('  npm found.')); // Use verboseLog
  }

  // Check yarn only if npm wasn't found
  if (!packageManagerFound && await checkCommandVersion('yarn', '-v', '1.22.0', verboseLog)) { // Pass logger
    packageManagerFound = true;
    verboseLog(chalk.green('  yarn found.')); // Use verboseLog
  }

  // Check pnpm only if npm and yarn weren't found
  if (!packageManagerFound && await checkCommandVersion('pnpm', '-v', '7.0.0', verboseLog)) { // Pass logger
    packageManagerFound = true;
    verboseLog(chalk.green('  pnpm found.')); // Use verboseLog
  }


  if (!packageManagerFound) {
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
