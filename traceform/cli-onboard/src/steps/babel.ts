import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { execa } from 'execa'; // Needed for install command

const BABEL_PLUGIN_NAME = '@lucidlayer/babel-plugin-traceform';

// --- Helper Functions ---

async function detectProjectType(projectRoot: string): Promise<'vite' | 'cra' | 'next' | 'babel' | 'unknown'> {
  // Check for specific config files or dependencies
  if (await fs.pathExists(path.join(projectRoot, 'vite.config.js')) || await fs.pathExists(path.join(projectRoot, 'vite.config.ts'))) {
    return 'vite';
  }
  if (await fs.pathExists(path.join(projectRoot, 'craco.config.js'))) {
    return 'cra'; // Assuming CRA with craco
  }
  if (await fs.pathExists(path.join(projectRoot, 'next.config.js'))) {
    return 'next';
  }
  if (await fs.pathExists(path.join(projectRoot, 'babel.config.js')) || await fs.pathExists(path.join(projectRoot, '.babelrc')) || await fs.pathExists(path.join(projectRoot, '.babelrc.js'))) {
    return 'babel'; // Generic Babel setup
  }
  // Add more checks if needed (e.g., check package.json for react-scripts without craco)
  return 'unknown';
}

function getBabelConfigSnippet(projectType: 'vite' | 'cra' | 'next' | 'babel' | 'unknown'): string {
  switch (projectType) {
    case 'vite':
      return `
// In vite.config.ts (or .js)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Add Traceform plugin ONLY during development
          ...(process.env.NODE_ENV === 'development' ? ['${BABEL_PLUGIN_NAME}'] : [])
        ],
      },
    }),
  ],
})
`;
    case 'cra': // Assumes craco
      return `
// In craco.config.js
module.exports = {
  babel: {
    plugins: [
      // Add Traceform plugin ONLY during development
      ...(process.env.NODE_ENV === 'development' ? ['${BABEL_PLUGIN_NAME}'] : [])
    ],
  },
};
`;
    case 'next':
      return `
// In .babelrc (for Next.js)
{
  "presets": ["next/babel"],
  "plugins": [
    // Add Traceform plugin ONLY during development
    ...(process.env.NODE_ENV === 'development' ? ["${BABEL_PLUGIN_NAME}"] : [])
  ]
}
`;
    case 'babel':
      return `
// In babel.config.js (or .babelrc)
module.exports = {
  presets: [/* your presets */],
  plugins: [
    // Add Traceform plugin ONLY during development
    ...(process.env.NODE_ENV === 'development' ? ['${BABEL_PLUGIN_NAME}'] : [])
  ],
};
`;
    default:
      return `
Could not automatically detect project type. Please add the following plugin
to your Babel configuration for development builds:
'${BABEL_PLUGIN_NAME}'

See documentation for examples: https://github.com/lucidlayer/traceform#getting-started-with-traceform
`;
  }
}

async function promptInstallPlugin(): Promise<boolean> {
  const { install } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'install',
      message: `${BABEL_PLUGIN_NAME} not found in package.json. Do you want to try installing it now? (Requires npm, yarn, or pnpm)`,
      default: true,
    },
  ]);
  return install;
}

async function installPlugin(projectRoot: string): Promise<boolean> {
  let packageManager = 'npm'; // Default
  // Basic check for lock files to guess package manager
  if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) packageManager = 'yarn';
  else if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) packageManager = 'pnpm';

  const installCommand = packageManager === 'yarn'
    ? `yarn add --dev ${BABEL_PLUGIN_NAME}`
    : `${packageManager} install --save-dev ${BABEL_PLUGIN_NAME}`;

  console.log(chalk.yellow(`  Running: ${installCommand}`));
  try {
    // Use execa to run the install command
    await execa(installCommand, { shell: true, stdio: 'inherit', cwd: projectRoot });
    console.log(chalk.green(`  Successfully installed ${BABEL_PLUGIN_NAME}.`));
    return true;
  } catch (error) {
    console.log(chalk.red(`  Error installing plugin: ${error instanceof Error ? error.message : error}`));
    console.log(chalk.yellow('  Please try installing it manually.'));
    return false;
  }
}


// --- Main Check Functions ---

async function checkPackageJson(projectRoot: string): Promise<boolean> {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  console.log(`  Checking package.json at: ${packageJsonPath}`);
  try {
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.yellow(`  Could not find package.json at ${packageJsonPath}. Skipping dependency check.`));
      return false; // Cannot proceed without package.json
    }
    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    if (dependencies[BABEL_PLUGIN_NAME] || devDependencies[BABEL_PLUGIN_NAME]) {
      console.log(chalk.green(`  Found ${BABEL_PLUGIN_NAME} in package.json.`));
      return true;
    } else {
      console.log(chalk.yellow(`  ${BABEL_PLUGIN_NAME} not found in package.json dependencies or devDependencies.`));
      const shouldInstall = await promptInstallPlugin();
      if (shouldInstall) {
        return await installPlugin(projectRoot);
      }
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`  Error reading or parsing package.json: ${error instanceof Error ? error.message : error}`));
    return false;
  }
}

async function checkConfigFiles(projectRoot: string): Promise<boolean> {
  const configFiles = [
    'babel.config.js', '.babelrc', '.babelrc.js',
    'vite.config.js', 'vite.config.ts',
    'craco.config.js', 'next.config.js', // Added next.config.js
  ];
  let foundInConfig = false;

  console.log('  Checking configuration files for Babel plugin usage...');

  for (const configFile of configFiles) {
    const configPath = path.join(projectRoot, configFile);
    try {
      if (await fs.pathExists(configPath)) {
        console.log(`  Checking config file: ${configPath}`);
        const content = await fs.readFile(configPath, 'utf-8');
        const pluginRegex = new RegExp(BABEL_PLUGIN_NAME.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        if (pluginRegex.test(content)) {
          console.log(chalk.green(`  Found reference to ${BABEL_PLUGIN_NAME} in ${configFile}.`));
          // Basic check: Does it seem to be conditional?
          if (content.includes('process.env.NODE_ENV') || content.includes('NODE_ENV')) {
             console.log(chalk.cyan('    (Looks like conditional usage based on NODE_ENV - good!)'));
          } else {
             console.log(chalk.yellow('    (Warning: Could not detect conditional usage. Ensure plugin runs only in development.)'));
          }
          foundInConfig = true;
          break;
        }
      }
    } catch (error) {
      console.log(chalk.yellow(`  Warning: Could not read or parse ${configFile}: ${error instanceof Error ? error.message : error}`));
    }
  }

  if (!foundInConfig) {
    console.log(chalk.red(`\n  Error: Could not find ${BABEL_PLUGIN_NAME} configured in common build tool config files.`));
    const projectType = await detectProjectType(projectRoot);
    console.log(chalk.yellow('\n  Action Required: Please add the plugin to your build configuration for DEVELOPMENT builds.'));
    console.log(chalk.cyan('  Based on your project structure, we detected type:', projectType));
    console.log(chalk.cyan('  Here is an example configuration snippet:'));
    console.log(chalk.gray('--------------------------------------------------'));
    console.log(getBabelConfigSnippet(projectType));
    console.log(chalk.gray('--------------------------------------------------'));
    return false;
  }

  return true;
}

// --- Exported Function ---

export async function checkBabelPlugin(): Promise<boolean> {
  console.log(chalk.bold('Checking Babel Plugin setup...'));
  const projectRoot = process.cwd(); // Get directory where command was run
  console.log(`  (Using project root: ${projectRoot})`);

  const depCheckPassed = await checkPackageJson(projectRoot);
  // Only check config if dependency is installed (or was just installed)
  const configCheckPassed = depCheckPassed ? await checkConfigFiles(projectRoot) : false;

  if (depCheckPassed && configCheckPassed) {
     console.log(chalk.green.bold('\n✅ Babel plugin setup appears correct.'));
     return true;
  } else {
     console.log(chalk.red.bold('\n❌ Babel plugin setup check failed or is incomplete. Please address the issues above.'));
     return false;
  }
}
