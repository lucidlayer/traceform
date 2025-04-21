/*
// SPDX-License-Identifier: Apache-2.0
*/

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
  stepIndex: number;
  totalSteps: number;
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
      return [
        '',
        'Could not automatically detect project type.',
        '',
        'Please add the following plugin to your Babel configuration for development builds:',
        '',
        `    '${BABEL_PLUGIN_NAME}'`,
        '',
        'See documentation for examples:',
        '  https://github.com/lucidlayer/traceform#getting-started-with-traceform',
        '',
        'Example (babel.config.js):',
        '',
        'module.exports = {',
        '  presets: [/* your existing presets */],',
        '  plugins: [',
        `    ...(process.env.NODE_ENV === 'development' ? ['${BABEL_PLUGIN_NAME}'] : []),`,
        '    // ... any other plugins you might have',
        '  ],',
        '};',
        ''
      ].join('\n');
  }
}

// --- Component ---

const BabelStep: React.FC<BabelStepProps> = ({ onComplete, stepIndex, totalSteps }) => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [configSnippet, setConfigSnippet] = useState<string>('');
  const [configFilePath, setConfigFilePath] = useState<string>('');
  const [finalResult, setFinalResult] = useState<BabelCheckStatus | null>(null);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState<string | null>(null);
  const [installCommand, setInstallCommand] = useState<string>('');
  const [depCheckPassed, setDepCheckPassed] = useState(false);
  const [waitingForDepContinue, setWaitingForDepContinue] = useState(false);
  const [configCheckPassed, setConfigCheckPassed] = useState(false);
  const [waitingForConfigContinue, setWaitingForConfigContinue] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const projectRoot = process.cwd();

  // --- Check Logic (Helper Functions) ---
  const detectPackageManager = async (): Promise<'npm' | 'yarn' | 'pnpm'> => {
    if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
      return 'yarn';
    } else if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
      return 'pnpm';
    }
    return 'npm';
  };

  const getInstallCommand = (pm: 'npm' | 'yarn' | 'pnpm') => {
    if (pm === 'yarn') return 'yarn add --dev @lucidlayer/babel-plugin-traceform';
    if (pm === 'pnpm') return 'pnpm add -D @lucidlayer/babel-plugin-traceform';
    return 'npm install --save-dev @lucidlayer/babel-plugin-traceform';
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
        setInstallCommand(getInstallCommand(await detectPackageManager()));
        return false;
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
      return false; // Wait for user interaction
    }
    return true;
  };

  // --- Check Logic (Adapted for New Flow) ---
  // 1. Check config first, then dependency
  const performChecks = async () => {
    setIsLoading(true);
    setShowConfigHelp(false);
    setShowContinuePrompt(false);
    setFinalResult(null);
    setPromptMessage(null);
    setStatus('Starting checks...');
    setDepCheckPassed(false);
    setWaitingForDepContinue(false);

    // 1. Check dependency first
    const pm = await detectPackageManager();
    setInstallCommand(getInstallCommand(pm));
    const depOk = await checkPackageJson();
    if (!depOk) {
      setFinalResult('failed_dependency');
      setPromptMessage('');
      setIsLoading(false);
      return;
    }
    // If dependency is found, show success and wait for Enter
    setDepCheckPassed(true);
    setIsLoading(false);
    setWaitingForDepContinue(true);
    return;
  };

  // Run checks only once on mount
  useEffect(() => {
    void performChecks();
  }, []);

  // Listen for Enter after dependency check passes
  useInput((input, key) => {
    if (waitingForDepContinue && key.return) {
      setWaitingForDepContinue(false);
      setIsLoading(true);
      // Now run config check
      (async () => {
        const configOk = await checkConfigFiles();
        if (!configOk) {
          setFinalResult('failed_config');
          setPromptMessage('');
          setIsLoading(false);
          return;
        }
        setConfigCheckPassed(true);
        setIsLoading(false);
        setWaitingForConfigContinue(true);
      })();
    }
    if (waitingForConfigContinue && key.return) {
      setWaitingForConfigContinue(false);
      setShowContinuePrompt(false);
      setConfigCheckPassed(false);
      setFinalResult('passed');
      onComplete('passed');
    }
  }, { isActive: waitingForDepContinue || waitingForConfigContinue });

  // Add useInput handler for retry/quit on failure
  useInput((input, key) => {
    if ((finalResult === 'failed_dependency' || finalResult === 'failed_config') && !isLoading) {
      if (input.toLowerCase() === 'r') {
        setFinalResult(null);
        setPromptMessage(null);
        void performChecks();
      } else if (input.toLowerCase() === 'q') {
        onComplete(finalResult);
      }
    }
  });

  // Handle input for quit confirmation and both parts of the step
  useInput((input, key) => {
    if (showQuitConfirm) {
      if (input.toLowerCase() === 'y') {
        onComplete('failed_config');
      } else if (input.toLowerCase() === 'n') {
        setShowQuitConfirm(false);
      }
      return;
    }
    // Show quit confirmation popup on 'q' in any part of the step
    if (input.toLowerCase() === 'q') {
      setShowQuitConfirm(true);
      return;
    }
    // Config step: copy and recheck
    if (showConfigHelp) {
      if (input.toLowerCase() === 'c') {
        clipboard.writeSync(configSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else if (input.toLowerCase() === 'r') {
        setIsLoading(true);
        (async () => {
          const configOk = await checkConfigFiles();
          if (!configOk) {
            setFinalResult('failed_config');
            setPromptMessage('');
            setIsLoading(false);
            return;
          }
          setConfigCheckPassed(true);
          setIsLoading(false);
          setWaitingForConfigContinue(true);
        })();
      }
    }
  }, { isActive: showConfigHelp || showQuitConfirm || depCheckPassed || waitingForDepContinue });

  // Format config file path for cross-platform clarity
  const formattedConfigFilePath = configFilePath.replace(/\\/g, '/');

  return (
    <Box flexDirection="column">
      <Text color="cyan">Step {stepIndex} of {totalSteps}</Text>
      <Text bold>--- Step 2: Babel Plugin ---</Text>
      <Box>
        <Text color={finalResult === 'passed' ? 'green' : finalResult ? 'red' : depCheckPassed || configCheckPassed ? 'green' : 'yellow'}>
          {isLoading ? <Spinner type="dots" /> : configCheckPassed ? '✔' : depCheckPassed ? '✔' : (finalResult === 'passed' ? "✔" : finalResult ? "✖" : "○")}{` ${configCheckPassed ? '@lucidlayer/babel-plugin-traceform is configured correctly.' : depCheckPassed ? '@lucidlayer/babel-plugin-traceform is installed in package.json.' : status}`}
        </Text>
      </Box>
      {depCheckPassed && waitingForDepContinue && (
        <Text color="cyan">Press Enter to continue...</Text>
      )}
      {finalResult === 'failed_dependency' && !isLoading && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="yellow">@lucidlayer/babel-plugin-traceform not found in package.json.</Text>
          <Text color="yellow">To continue, open a new terminal and run:</Text>
          <Text color="cyan">  {installCommand}</Text>
          <Text color="yellow">After installing, return here and press R to retry, or Q to quit.</Text>
        </Box>
      )}
      {showConfigHelp && !showQuitConfirm && (
        <Box flexDirection="column">
          <Text color="yellow">Paste this snippet into your config file: {formattedConfigFilePath} for DEVELOPMENT builds.</Text>
          <Box marginY={1} paddingLeft={2} flexDirection="column">
            {configSnippet.split('\n').map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
          </Box>
          <Text color="magenta">Press <Text bold>C</Text> to copy the code snippet to your clipboard.</Text>
          {copied && <Text color="green">Code snippet copied to clipboard!</Text>}
          <Text color="yellow">After updating your config, press R to retry, or Q to quit.</Text>
        </Box>
      )}
      {showQuitConfirm && (
        <Box
          borderStyle="round"
          borderColor="yellow"
          padding={1}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginTop={1}
        >
          <Text color="yellow" bold>Are you sure you want to quit the onboarding? (y/n)</Text>
        </Box>
      )}
      {finalResult === 'failed_config' && !isLoading && !showConfigHelp && (
        <Text color="red">Babel plugin is not configured. Add the snippet above and press R to recheck, or Q to quit.</Text>
      )}
      {configCheckPassed && waitingForConfigContinue && (
        <Text color="cyan">Press Enter to continue...</Text>
      )}
      {showContinuePrompt && (
        <Text color="cyan">Press Enter to continue...</Text>
      )}
    </Box>
  );
};

export default BabelStep;
