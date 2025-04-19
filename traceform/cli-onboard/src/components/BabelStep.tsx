import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, Newline } from 'ink';
import Spinner from 'ink-spinner';
import fs from 'fs-extra'; // Use fs-extra methods directly
import path from 'path';
import { useInput } from 'ink';
import clipboard from 'clipboardy';

// Type definitions
export type BabelCheckStatus = 'passed' | 'failed_dependency' | 'failed_config'; // Export the type
interface BabelStepProps {
  onComplete: (status: BabelCheckStatus) => void;
}

const BABEL_PLUGIN_NAME = '@lucidlayer/babel-plugin-traceform';

// --- Helper Functions (Adapted) ---

// Note: Verbose logging is removed, TUI will show status directly
async function detectProjectType(projectRoot: string): Promise<'vite' | 'cra' | 'next' | 'babel' | 'unknown'> {
  if (await fs.pathExists(path.join(projectRoot, 'vite.config.js')) || await fs.pathExists(path.join(projectRoot, 'vite.config.ts'))) {
    return 'vite';
  }
  if (await fs.pathExists(path.join(projectRoot, 'craco.config.js'))) {
    return 'cra';
  }
  if (await fs.pathExists(path.join(projectRoot, 'next.config.js'))) {
    return 'next';
  }
  if (await fs.pathExists(path.join(projectRoot, 'babel.config.js')) || await fs.pathExists(path.join(projectRoot, '.babelrc')) || await fs.pathExists(path.join(projectRoot, '.babelrc.js'))) {
    return 'babel';
  }
  return 'unknown';
}

function getBabelConfigSnippet(projectType: 'vite' | 'cra' | 'next' | 'babel' | 'unknown'): string {
  // (Snippet logic remains the same as original)
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
`;
    case 'cra':
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

// --- Component ---

const BabelStep: React.FC<BabelStepProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [isLoading, setIsLoading] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [configSnippet, setConfigSnippet] = useState<string>('');
  const [configFilePath, setConfigFilePath] = useState<string>('');
  const [showRecheckPrompt, setShowRecheckPrompt] = useState(false);
  const [finalResult, setFinalResult] = useState<BabelCheckStatus | null>(null);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const projectRoot = process.cwd(); // Assuming CWD is the target project

  // --- Check Logic (Helper Functions) ---
  const installPlugin = async (): Promise<boolean> => {
    setStatus('Detecting package manager...');
    let packageManager = 'npm';
    if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
      packageManager = 'yarn';
    } else if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
      packageManager = 'pnpm';
    }
    const installCommand = packageManager === 'yarn'
      ? `yarn add --dev ${BABEL_PLUGIN_NAME}`
      : `${packageManager} install --save-dev ${BABEL_PLUGIN_NAME}`;
    setStatus(`Attempting to install ${BABEL_PLUGIN_NAME} using ${packageManager}...`);
    try {
      const { execa } = await import('execa');
      await execa(installCommand, { shell: true, cwd: projectRoot });
      setStatus(`Successfully installed ${BABEL_PLUGIN_NAME}.`);
      return true;
    } catch (error: any) {
      const errorDetails = error.stderr?.split('\n')[0] ?? error.shortMessage ?? String(error);
      setStatus(`Error installing plugin: ${errorDetails}. Please try installing manually: ${installCommand}`);
      return false;
    }
  };

  const checkPackageJson = async (): Promise<boolean> => {
    setStatus(`Checking package.json for ${BABEL_PLUGIN_NAME}...`);
    const packageJsonPath = path.join(projectRoot, 'package.json');
    try {
      if (!await fs.pathExists(packageJsonPath)) {
        setStatus(`Could not find package.json at ${packageJsonPath}. Skipping dependency check.`);
        return false;
      }
      const packageJson = await fs.readJson(packageJsonPath);
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      if (dependencies[BABEL_PLUGIN_NAME] || devDependencies[BABEL_PLUGIN_NAME]) {
        setStatus(`Found ${BABEL_PLUGIN_NAME} in package.json.`);
        return true;
      } else {
        setStatus(`${BABEL_PLUGIN_NAME} not found in package.json.`);
        setShowInstallPrompt(true); // Trigger install prompt UI
        return false; // Wait for user interaction
      }
    } catch (error) {
      setStatus(`Error reading or parsing package.json: ${error instanceof Error ? error.message : error}`);
      return false;
    }
  };

  const checkConfigFiles = async (): Promise<boolean> => {
    setStatus('Checking configuration files for Babel plugin usage...');
    const configFiles = [
      'babel.config.js', '.babelrc', '.babelrc.js',
      'vite.config.js', 'vite.config.ts',
      'craco.config.js', 'next.config.js',
    ];
    let foundInConfig = false;
    for (const configFile of configFiles) {
      const configPath = path.join(projectRoot, configFile);
      try {
        if (await fs.pathExists(configPath)) {
          const content = await fs.readFile(configPath, 'utf-8');
          const pluginRegex = new RegExp(BABEL_PLUGIN_NAME.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
          if (pluginRegex.test(content)) {
            setStatus(`Found reference to ${BABEL_PLUGIN_NAME} in ${configFile}.`);
            foundInConfig = true;
            break;
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not read or parse ${configFile}: ${error instanceof Error ? error.message : error}`);
      }
    }
    if (!foundInConfig) {
      setStatus(`Error: Could not find ${BABEL_PLUGIN_NAME} configured.`);
      const projectType = await detectProjectType(projectRoot);
      let targetFileNameSuggestion = 'your Babel/Vite/Craco config file';
      let likelyFileName = '';
      if (projectType === 'vite') { targetFileNameSuggestion = 'vite.config.js / vite.config.ts'; likelyFileName = 'vite.config.ts'; }
      else if (projectType === 'cra') { targetFileNameSuggestion = 'craco.config.js'; likelyFileName = 'craco.config.js'; }
      else if (projectType === 'next') { targetFileNameSuggestion = '.babelrc'; likelyFileName = '.babelrc'; }
      else if (projectType === 'babel') { targetFileNameSuggestion = 'babel.config.js / .babelrc / .babelrc.js'; likelyFileName = 'babel.config.js'; }
      const fullConfigPath = likelyFileName ? path.join(projectRoot, likelyFileName) : targetFileNameSuggestion;
      setConfigFilePath(fullConfigPath); // Store path for display
      setConfigSnippet(getBabelConfigSnippet(projectType));
      setShowConfigHelp(true); // Trigger config help UI
      setShowRecheckPrompt(true); // Trigger recheck prompt UI
      return false; // Wait for user interaction
    }
    return true;
  };

  // --- Check Logic (Adapted for New Flow) ---
  // 1. Check config first, then dependency
  const performChecks = async () => {
    setIsLoading(true);
    // Reset states before checks
    setShowInstallPrompt(false);
    setShowConfigHelp(false);
    setShowRecheckPrompt(false);
    setShowContinuePrompt(false); // Ensure continue prompt is hidden
    setFinalResult(null); // Reset final result before checks
    setStatus('Starting checks...'); // Initial status

    // 1. Check config file first
    const configOk = await checkConfigFiles();
    if (!configOk) {
      // Show config help and wait for user interaction
      setIsLoading(false);
      return;
    }
    // 2. After config is confirmed, check dependency
    const depOk = await checkPackageJson();
    if (!depOk) {
      // If dep check returned false and didn't trigger prompt (e.g., file error), fail immediately
      if (!showInstallPrompt) {
        setFinalResult('failed_dependency');
        onComplete('failed_dependency');
      }
      setIsLoading(false);
      return;
    }
    // 3. If both are OK, show continue prompt
    setStatus('✅ Babel plugin setup appears correct.');
    setFinalResult('passed');
    setIsLoading(false);
    // Wait for user confirmation in continue prompt before calling onComplete('passed')
  };

  // Run checks only once on mount
  useEffect(() => {
    void performChecks();
  }, []); // Empty dependency array ensures it runs only once initially

  // Effect to trigger the continue prompt ONLY when checks pass
  useEffect(() => {
    if (finalResult === 'passed' && !isLoading) {
      setShowContinuePrompt(true); // Trigger the prompt to ask user if they want to continue
    }
    // Failure cases are now handled directly by the prompt handlers calling onComplete
  }, [finalResult, isLoading]);

  // Effect to handle the continue prompt
  useEffect(() => {
    if (showContinuePrompt) {
      const prompt = async () => {
        setPromptMessage('Press Enter to continue...'); // Show waiting message
        const inquirer = (await import('inquirer')).default;
        const { proceed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Babel setup passed. Proceed to next step?',
            default: true,
          },
        ]);
        setPromptMessage(null); // Clear waiting message
        setShowContinuePrompt(false); // Hide prompt trigger
        if (proceed) {
          // Wait for user confirmation before proceeding
          setTimeout(() => {
            setShowContinuePrompt(true);
            setPromptMessage('Press Enter to continue...');
          }, 750);
        } else {
          onComplete('failed_config');
        }
      };
      void prompt();
    }
  }, [showContinuePrompt, onComplete]); // Keep onComplete here as it's called directly

  // --- Prompt Handlers ---
  const handleInstallConfirm = async (confirm: boolean) => {
    setShowInstallPrompt(false); // Hide prompt indicator
    if (confirm) {
      setIsLoading(true); // Show loading while installing
      const installed = await installPlugin();
      if (installed) {
        // Re-run checks after successful install
        void performChecks();
      } else {
        // Install failed - call onComplete directly
        setFinalResult('failed_dependency'); // Update state for UI message
        setIsLoading(false);
        onComplete('failed_dependency'); // Signal failure to parent
      }
    } else {
      setStatus('Skipping installation.');
      setFinalResult('failed_dependency'); // Update state for UI message
      setIsLoading(false);
      onComplete('failed_dependency'); // Signal failure to parent
    }
  };

  const handleRecheckConfirm = async (confirm: boolean) => {
    setShowRecheckPrompt(false); // Hide prompt indicator
    setShowConfigHelp(false); // Hide help text after decision
    if (confirm) {
      // Re-run checks
      void performChecks();
    } else {
      setStatus('Configuration not updated. Please add the configuration and try again.');
      setFinalResult('failed_config');
      setIsLoading(false);
      onComplete('failed_config');
    }
  };

   // --- Dynamic Inquirer Prompts ---
  useEffect(() => {
    if (showInstallPrompt) {
      const prompt = async () => {
        const inquirer = (await import('inquirer')).default;
        const { install } = await inquirer.prompt([
          { type: 'confirm', name: 'install', message: `${BABEL_PLUGIN_NAME} not found. Install now?`, default: true },
        ]);
        await handleInstallConfirm(install);
      };
      void prompt();
    }
  }, [showInstallPrompt]);

  useEffect(() => {
    if (showRecheckPrompt) {
      const prompt = async () => {
        const inquirer = (await import('inquirer')).default;
        const { recheck } = await inquirer.prompt([
          { type: 'confirm', name: 'recheck', message: 'After adding the snippet, re-check configuration?', default: true },
        ]);
        await handleRecheckConfirm(recheck);
      };
      void prompt();
    }
  }, [showRecheckPrompt]);

  // Handle 'c' key to copy code snippet
  useInput((input, key) => {
    if (showConfigHelp && (input === 'c' || input === 'C')) {
      clipboard.writeSync(configSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, { isActive: showConfigHelp });

  // Add a useInput hook to listen for the continue prompt key
  useInput((input, key) => {
    if (showContinuePrompt && key.return) {
      setShowContinuePrompt(false);
      setPromptMessage(null);
      onComplete('passed');
      return; // Prevent further propagation
    }
  }, { isActive: showContinuePrompt });

  return (
    <Box flexDirection="column">
      <Text bold>--- Step 2: Babel Plugin ---</Text>
      <Box>
        <Text color={finalResult === 'passed' ? 'green' : finalResult ? 'red' : 'yellow'}>
          {isLoading && !showInstallPrompt && !showRecheckPrompt ? <Spinner type="dots" /> : (finalResult === 'passed' ? "✔" : finalResult ? "✖" : "○")}{` ${status}`}
        </Text>
      </Box>
      {showInstallPrompt && <Text color="yellow">Waiting for install confirmation...</Text>}
      {showConfigHelp && (
        <Box flexDirection="column">
          <Text color="yellow">Action Required: Add the plugin to <Text bold>{configFilePath}</Text> for DEVELOPMENT builds.</Text>
          <Text color="cyan">Copy and paste the following snippet:</Text>
          <Text color="magenta">Press <Text bold>C</Text> to copy the code snippet to your clipboard.</Text>
          <Box marginY={1} flexDirection="column">
            {configSnippet.split('\n').map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
          </Box>
          {copied && <Text color="green">Code snippet copied to clipboard!</Text>}
        </Box>
      )}
      {showRecheckPrompt && <>
        <Text color="yellow">Waiting for re-check confirmation...</Text>
        <Newline />
        <Text color="magenta" bold>
          ⬆️⬆️ PLEASE SCROLL UP TO SEE THE INSTRUCTIONS ⬆️⬆️
        </Text>
        <Newline />
      </>}
      {promptMessage && (
        <Box marginTop={1}>
          <Text color="cyan">{promptMessage}</Text>
        </Box>
      )}
      {!isLoading && !showInstallPrompt && !showRecheckPrompt && !showContinuePrompt && finalResult === 'failed_dependency' && <Text color="red">Babel plugin dependency is missing or install failed.</Text>}
      {!isLoading && !showInstallPrompt && !showRecheckPrompt && !showContinuePrompt && finalResult === 'failed_config' && <Text color="red">Babel plugin configuration is missing or incorrect.</Text>}
      {!isLoading && !showInstallPrompt && !showRecheckPrompt && !showContinuePrompt && finalResult === 'passed' && <Text color="green">Babel setup passed.</Text>}
    </Box>
  );
};

export default BabelStep;
