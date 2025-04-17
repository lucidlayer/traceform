import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

const BABEL_PLUGIN_NAME = '@lucidlayer/babel-plugin-traceform';

// Function to check package.json for the dependency
async function checkPackageJson(projectRoot: string): Promise<boolean> {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  console.log(`  Checking package.json at: ${packageJsonPath}`); // Add logging
  try {
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.yellow(`  Could not find package.json at ${packageJsonPath}. Skipping dependency check.`));
      return false; // Cannot confirm without package.json
    }
    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    if (dependencies[BABEL_PLUGIN_NAME] || devDependencies[BABEL_PLUGIN_NAME]) {
      console.log(chalk.green(`  Found ${BABEL_PLUGIN_NAME} in package.json.`));
      return true;
    } else {
      console.log(chalk.red(`  Error: ${BABEL_PLUGIN_NAME} not found in package.json dependencies or devDependencies.`));
      console.log(chalk.yellow(`  Please install it: npm install --save-dev ${BABEL_PLUGIN_NAME} (or yarn/pnpm equivalent)`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`  Error reading or parsing package.json: ${error instanceof Error ? error.message : error}`));
    return false;
  }
}

// Function to check common config files for plugin usage
async function checkConfigFiles(projectRoot: string): Promise<boolean> {
  const configFiles = [
    'babel.config.js',
    '.babelrc',
    '.babelrc.js',
    'vite.config.js',
    'vite.config.ts',
    'craco.config.js',
  ];
  let foundInConfig = false;

  console.log('  Checking configuration files for Babel plugin usage...');

  for (const configFile of configFiles) {
    const configPath = path.join(projectRoot, configFile);
    try {
      if (await fs.pathExists(configPath)) {
        console.log(`  Checking config file: ${configPath}`); // Add logging
        const content = await fs.readFile(configPath, 'utf-8');
        // Use regex for a more robust check (handles different quotes/spacing)
        // Escape special characters in the plugin name for regex safety
        const pluginRegex = new RegExp(BABEL_PLUGIN_NAME.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        if (pluginRegex.test(content)) {
          console.log(chalk.green(`  Found reference to ${BABEL_PLUGIN_NAME} in ${configFile}.`));
          foundInConfig = true;
          break; // Stop checking once found
        }
      }
    } catch (error) {
      console.log(chalk.yellow(`  Warning: Could not read or parse ${configFile}: ${error instanceof Error ? error.message : error}`));
    }
  }

  if (!foundInConfig) {
    console.log(chalk.red(`  Error: Could not find ${BABEL_PLUGIN_NAME} configured in common build tool config files.`));
    console.log(chalk.yellow('  Please ensure the plugin is added to your Babel/Vite/Craco config for DEVELOPMENT builds only.'));
    console.log(chalk.cyan('  See examples: https://github.com/lucidlayer/traceform#getting-started-with-traceform'));
    return false;
  }

  return true;
}

export async function checkBabelPlugin(): Promise<boolean> {
  console.log('Checking Babel Plugin setup...');
  // Assume the CLI is run from the project root for now
  const projectRoot = process.cwd(); // Get current working directory
  console.log(`  Project root detected as: ${projectRoot}`); // Add logging

  const depCheckPassed = await checkPackageJson(projectRoot);
  const configCheckPassed = await checkConfigFiles(projectRoot);

  if (depCheckPassed && configCheckPassed) {
     console.log(chalk.green('  Babel plugin setup appears correct.'));
     return true;
  } else {
     console.log(chalk.red('\nBabel plugin setup check failed. Please address the issues above.'));
     return false;
  }
}
