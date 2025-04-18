import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
// Removed static execa import - will use dynamic import below

// Define the type for the verbose logger function
type VerboseLogger = (...args: any[]) => void;

const BABEL_PLUGIN_NAME = '@lucidlayer/babel-plugin-traceform';

// --- Helper Functions ---

async function detectProjectType(projectRoot: string, verboseLog: VerboseLogger): Promise<'vite' | 'cra' | 'next' | 'babel' | 'unknown'> {
  verboseLog('  Detecting project type...');
  // Check for specific config files or dependencies
  if (await fs.pathExists(path.join(projectRoot, 'vite.config.js')) || await fs.pathExists(path.join(projectRoot, 'vite.config.ts'))) {
    verboseLog('  Detected Vite project.');
    return 'vite';
    return 'vite';
  }
  if (await fs.pathExists(path.join(projectRoot, 'craco.config.js'))) {
    verboseLog('  Detected CRA (with Craco) project.');
    return 'cra'; // Assuming CRA with craco
  }
  if (await fs.pathExists(path.join(projectRoot, 'next.config.js'))) {
    verboseLog('  Detected Next.js project.');
    return 'next';
  }
  if (await fs.pathExists(path.join(projectRoot, 'babel.config.js')) || await fs.pathExists(path.join(projectRoot, '.babelrc')) || await fs.pathExists(path.join(projectRoot, '.babelrc.js'))) {
    verboseLog('  Detected generic Babel project.');
    return 'babel'; // Generic Babel setup
  }
  // Add more checks if needed (e.g., check package.json for react-scripts without craco)
  verboseLog('  Could not detect specific project type.');
  return 'unknown';
}

function getBabelConfigSnippet(projectType: 'vite' | 'cra' | 'next' | 'babel' | 'unknown'): string {
  // This function generates snippets, no verbose logging needed inside
  switch (projectType) {
    case 'vite':
      return `
// In vite.config.ts (or .js)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({ // Make sure this is the @vitejs/plugin-react plugin
      babel: { // Add or modify the 'babel' property within the react plugin options
        plugins: [
          // Add Traceform plugin ONLY during development inside the 'plugins' array
          ...(process.env.NODE_ENV === 'development' ? ['${BABEL_PLUGIN_NAME}'] : [])
        ],
      },
    }),
  ],
})

// Note: If you get a TypeScript error like "Cannot find name 'process'",
// you may need to install Node.js types in your project:
// npm install --save-dev @types/node
// or yarn add --dev @types/node
`;
    case 'cra': // Assumes craco
      return `
// In craco.config.js
module.exports = {
  babel: { // Add or modify the 'babel' property
    plugins: [
      // Add Traceform plugin ONLY during development inside the 'plugins' array
      ...(process.env.NODE_ENV === 'development' ? ['${BABEL_PLUGIN_NAME}'] : [])
    ],
  },
};
`;
    case 'next':
      return `
// In .babelrc (for Next.js)
{
  "presets": ["next/babel"], // Keep your existing presets
  "plugins": [
    // Add Traceform plugin ONLY during development to the 'plugins' array
    ...(process.env.NODE_ENV === 'development' ? ["${BABEL_PLUGIN_NAME}"] : [])
    // ... any other plugins you might have
  ]
}
`;
    case 'babel':
      return `
// In babel.config.js (or .babelrc)
module.exports = {
  presets: [/* your existing presets */],
  plugins: [
    // Add Traceform plugin ONLY during development to the 'plugins' array
    ...(process.env.NODE_ENV === 'development' ? ['${BABEL_PLUGIN_NAME}'] : [])
    // ... any other plugins you might have
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

async function installPlugin(projectRoot: string, verboseLog: VerboseLogger): Promise<boolean> {
  let packageManager = 'npm'; // Default
  verboseLog('  Detecting package manager...');
  // Basic check for lock files to guess package manager
  if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
    packageManager = 'yarn';
    verboseLog('  Found yarn.lock, using yarn.');
  } else if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
    verboseLog('  Found pnpm-lock.yaml, using pnpm.');
  } else {
    verboseLog('  No lockfile found, defaulting to npm.');
  }


  const installCommand = packageManager === 'yarn'
    ? `yarn add --dev ${BABEL_PLUGIN_NAME}`
    : `${packageManager} install --save-dev ${BABEL_PLUGIN_NAME}`;

  console.log(chalk.yellow(`  Attempting to install ${BABEL_PLUGIN_NAME} using ${packageManager}...`));
  try {
    // Dynamically import execa here as it's an ESM module
    const { execa } = await import('execa');
    // Use execa to run the install command, capture output
    const { stdout, stderr } = await execa(installCommand, { shell: true, cwd: projectRoot });
    // Log stdout/stderr only if needed for debugging, or on error
    // console.log('Install stdout:', stdout);
    // if (stderr) console.error('Install stderr:', stderr);
    console.log(chalk.green(`  ✅ Successfully installed ${BABEL_PLUGIN_NAME}.`));
    return true;
  } catch (error: any) {
    console.error(chalk.red(`  ❌ Error installing plugin.`));
    // Attempt to show a cleaner error message from execa
    if (error.stderr) {
      console.error(chalk.red(`  Error details: ${error.stderr.split('\n')[0]}`)); // Show first line of stderr
    } else if (error.shortMessage) {
      console.error(chalk.red(`  Error details: ${error.shortMessage}`));
    } else {
      console.error(chalk.red(`  Error details: ${error instanceof Error ? error.message : String(error)}`));
    }
    console.log(chalk.yellow(`  Please try installing manually: ${chalk.bold(installCommand)}`));
    return false;
  }
}


// --- Main Check Functions ---

async function checkPackageJson(projectRoot: string, verboseLog: VerboseLogger): Promise<boolean> {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  verboseLog(`  Checking package.json at: ${packageJsonPath}`); // Use verboseLog
  try {
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.yellow(`  Could not find package.json at ${packageJsonPath}. Skipping dependency check.`)); // Keep as console.log (warning)
      return false; // Cannot proceed without package.json
    }
    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    if (dependencies[BABEL_PLUGIN_NAME] || devDependencies[BABEL_PLUGIN_NAME]) {
      console.log(chalk.green(`  Found ${BABEL_PLUGIN_NAME} in package.json.`));
      verboseLog(chalk.green(`  Found ${BABEL_PLUGIN_NAME} in package.json.`)); // Use verboseLog
      return true;
    } else {
      console.log(chalk.yellow(`  ${BABEL_PLUGIN_NAME} not found in package.json dependencies or devDependencies.`)); // Keep as console.log (warning)
      const shouldInstall = await promptInstallPlugin();
      if (shouldInstall) {
        return await installPlugin(projectRoot, verboseLog); // Pass logger
      }
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`  Error reading or parsing package.json: ${error instanceof Error ? error.message : error}`)); // Keep as console.log (error)
    return false;
  }
}

async function checkConfigFiles(projectRoot: string, verboseLog: VerboseLogger): Promise<boolean> { // Add verboseLog parameter
  const configFiles = [
    'babel.config.js', '.babelrc', '.babelrc.js',
    'vite.config.js', 'vite.config.ts',
    'craco.config.js', 'next.config.js', // Added next.config.js
  ];
  let foundInConfig = false;

  verboseLog('  Checking configuration files for Babel plugin usage...'); // Use verboseLog

  for (const configFile of configFiles) {
    const configPath = path.join(projectRoot, configFile);
    try {
      if (await fs.pathExists(configPath)) {
        verboseLog(`  Checking config file: ${configPath}`); // Use verboseLog
        const content = await fs.readFile(configPath, 'utf-8');
        const pluginRegex = new RegExp(BABEL_PLUGIN_NAME.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        if (pluginRegex.test(content)) {
          console.log(chalk.green(`  Found reference to ${BABEL_PLUGIN_NAME} in ${configFile}.`)); // Keep as console.log (success)
          // Basic check: Does it seem to be conditional?
          if (content.includes('process.env.NODE_ENV') || content.includes('NODE_ENV')) {
             verboseLog(chalk.cyan('    (Looks like conditional usage based on NODE_ENV - good!)')); // Use verboseLog
          } else {
             console.log(chalk.yellow('    (Warning: Could not detect conditional usage. Ensure plugin runs only in development.)')); // Keep as console.log (warning)
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
    console.log(chalk.red(`\n  Error: Could not find ${BABEL_PLUGIN_NAME} configured in common build tool config files.`)); // Keep as console.log (error)
    // Add clarification that the dependency itself IS present at this point
    console.log(chalk.cyan(`  (Note: The dependency ${BABEL_PLUGIN_NAME} was found in your package.json, but it still needs to be configured below).`)); // Keep as console.log (info)
    const projectType = await detectProjectType(projectRoot, verboseLog); // Pass logger
    let targetFileNameSuggestion = 'your Babel/Vite/Craco config file';
    let likelyFileName = ''; // Store a single likely file name for the path
    // Suggest a specific file based on detection
    if (projectType === 'vite') {
      targetFileNameSuggestion = 'vite.config.js / vite.config.ts';
      likelyFileName = 'vite.config.ts'; // Prioritize TS? Or check existence? Let's pick one for now.
    } else if (projectType === 'cra') {
      targetFileNameSuggestion = 'craco.config.js';
      likelyFileName = 'craco.config.js';
    } else if (projectType === 'next') {
      targetFileNameSuggestion = '.babelrc';
      likelyFileName = '.babelrc';
    } else if (projectType === 'babel') {
      targetFileNameSuggestion = 'babel.config.js / .babelrc / .babelrc.js';
      likelyFileName = 'babel.config.js'; // Prioritize babel.config.js?
    }

    const fullConfigPath = likelyFileName ? path.join(projectRoot, likelyFileName) : targetFileNameSuggestion;

    // ENHANCED: More explicit actionable message
    console.log(chalk.yellow(`\n  Action Required: Please add the Traceform Babel plugin to ${chalk.bold(fullConfigPath)} for DEVELOPMENT builds.`));
    console.log(chalk.cyan(`  (Suggested file(s): ${targetFileNameSuggestion})`));
    console.log(chalk.cyan('  Locate the "plugins" array (or equivalent) in your config file.'));
    console.log(chalk.cyan('  Insert the following line at the appropriate place (see comment):'));
    console.log(chalk.gray('\n------------------- SNIPPET START ------------------'));
    // Indent the snippet and add an insertion-point comment
    let snippet = getBabelConfigSnippet(projectType)
      .split('\n')
      .map(line => {
        if (line.includes(BABEL_PLUGIN_NAME)) {
          return line + ' // <-- Add this line';
        }
        return '  ' + line;
      })
      .join('\n');
    console.log(chalk.white(snippet));
    console.log(chalk.gray('-------------------- SNIPPET END -------------------'));
    console.log(chalk.yellow('  After saving your changes, re-run this check to continue.'));
    return false;
  }

  return true;
}

type BabelCheckStatus = 'passed' | 'failed_dependency' | 'failed_config';

// --- Exported Function ---

export async function checkBabelPlugin(verboseLog: VerboseLogger): Promise<BabelCheckStatus> { // Add logger parameter
  // console.log(chalk.bold('Checking Babel Plugin setup...')); // This is logged by index.ts now
  const projectRoot = process.cwd(); // Get directory where command was run
  verboseLog(`  (Using project root: ${projectRoot})`); // Use verboseLog

  const depCheckResult = await checkPackageJson(projectRoot, verboseLog); // Pass logger
  if (!depCheckResult) {
    // If dependency check failed (and user likely declined install)
    console.log(chalk.red.bold('\n❌ Babel plugin dependency is missing.')); // Keep as console.log (error)
    return 'failed_dependency';
  }

  // Dependency is present, now check config
  const configCheckPassed = await checkConfigFiles(projectRoot, verboseLog); // Pass logger

  if (configCheckPassed) {
     console.log(chalk.green.bold('\n✅ Babel plugin setup appears correct.')); // Keep as console.log (success)
     return 'passed';
  } else {
     // Dependency present, but config is missing/incorrect
     console.log(chalk.red.bold('\n❌ Babel plugin configuration is missing or incorrect. Please address the issues above.')); // Keep as console.log (error)
     return 'failed_config';
  }
}
