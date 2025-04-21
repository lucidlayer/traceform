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
import { execa } from 'execa';
import Link from 'ink-link';

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
  // Step state: 1 = plugin, 2 = @types/node, 3 = config
  const [subStep, setSubStep] = useState<1 | 2 | 3>(1);
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
  const [typesCheckPassed, setTypesCheckPassed] = useState(false);
  const [configCheckPassed, setConfigCheckPassed] = useState(false);
  const [waitingForDepContinue, setWaitingForDepContinue] = useState(false);
  const [waitingForTypesContinue, setWaitingForTypesContinue] = useState(false);
  const [waitingForConfigContinue, setWaitingForConfigContinue] = useState(false);
  const [copied, setCopied] = useState(false);
  const [awaitingTypesInstall, setAwaitingTypesInstall] = useState(false);
  const [typesInstallError, setTypesInstallError] = useState<string | null>(null);
  const [awaitingPluginInstall, setAwaitingPluginInstall] = useState(false);
  const [pluginInstallError, setPluginInstallError] = useState<string | null>(null);

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

  // --- Helper for @types/node ---
  const getTypesInstallCommand = (pm: 'npm' | 'yarn' | 'pnpm') => {
    if (pm === 'yarn') return 'yarn add --dev @types/node';
    if (pm === 'pnpm') return 'pnpm add -D @types/node';
    return 'npm install --save-dev @types/node';
  };
  const checkTypesNode = async (): Promise<boolean> => {
    setStatus('Checking package.json for @types/node...');
    const packageJsonPath = path.join(projectRoot, 'package.json');
    try {
      if (!await fs.pathExists(packageJsonPath)) {
        setStatus(`Could not find package.json at ${packageJsonPath}. Skipping @types/node check.`);
        return false;
      }
      const packageJson = await fs.readJson(packageJsonPath);
      const devDependencies = packageJson.devDependencies || {};
      if (devDependencies['@types/node']) {
        setStatus('Found @types/node in devDependencies.');
        return true;
      } else {
        setStatus('@types/node not found in devDependencies.');
        setInstallCommand(getTypesInstallCommand(await detectPackageManager()));
        return false;
      }
    } catch (error) {
      setStatus(`Error reading or parsing package.json: ${error instanceof Error ? error.message : error}`);
      return false;
    }
  };

  // --- Step logic ---
  useEffect(() => {
    const runStep = async () => {
      setIsLoading(true);
      setShowConfigHelp(false);
      setShowContinuePrompt(false);
      setFinalResult(null);
      setPromptMessage(null);
      setTypesInstallError(null);
      setPluginInstallError(null);
      if (subStep === 1) {
        setStatus('Starting plugin check...');
        setDepCheckPassed(false);
        setWaitingForDepContinue(false);
        setAwaitingPluginInstall(false);
        const pm = await detectPackageManager();
        setInstallCommand(getInstallCommand(pm));
        const depOk = await checkPackageJson();
        if (!depOk) {
          setAwaitingPluginInstall(true);
          setIsLoading(false);
          return;
        }
        setDepCheckPassed(true);
        setIsLoading(false);
        setWaitingForDepContinue(true);
      } else if (subStep === 2) {
        setStatus('Starting @types/node check...');
        setTypesCheckPassed(false);
        setWaitingForTypesContinue(false);
        setAwaitingTypesInstall(false);
        const pm = await detectPackageManager();
        setInstallCommand(getTypesInstallCommand(pm));
        const typesOk = await checkTypesNode();
        if (!typesOk) {
          setAwaitingTypesInstall(true);
          setIsLoading(false);
          return;
        }
        setTypesCheckPassed(true);
        setIsLoading(false);
        setWaitingForTypesContinue(true);
      } else if (subStep === 3) {
        setStatus('Starting config check...');
        setConfigCheckPassed(false);
        setWaitingForConfigContinue(false);
        const configOk = await checkConfigFiles();
        if (!configOk) {
          setFinalResult('failed_config');
          setIsLoading(false);
          return;
        }
        setConfigCheckPassed(true);
        setIsLoading(false);
        setWaitingForConfigContinue(true);
      }
    };
    void runStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subStep]);

  // Navigation for each part
  useInput((input, key) => {
    if (waitingForDepContinue && key.return) {
      setWaitingForDepContinue(false);
      setSubStep(2);
    } else if (waitingForTypesContinue && key.return) {
      setWaitingForTypesContinue(false);
      setSubStep(3);
    } else if (waitingForConfigContinue && key.return) {
      setWaitingForConfigContinue(false);
      setShowContinuePrompt(false);
      setConfigCheckPassed(false);
      setFinalResult('passed');
      onComplete('passed');
    }
  }, { isActive: waitingForDepContinue || waitingForTypesContinue || waitingForConfigContinue });

  // Handle install prompt for Babel plugin
  useInput((input, key) => {
    if (subStep === 1 && awaitingPluginInstall && !isLoading) {
      if (input.toLowerCase() === 'y') {
        setIsLoading(true);
        setPluginInstallError(null);
        (async () => {
          try {
            await execa(installCommand, { stdio: 'inherit', shell: true });
            // After install, re-check
            const depOk = await checkPackageJson();
            if (depOk) {
              setDepCheckPassed(true);
              setIsLoading(false);
              setAwaitingPluginInstall(false);
              setWaitingForDepContinue(true);
            } else {
              setPluginInstallError('Install completed, but @lucidlayer/babel-plugin-traceform still not found.');
              setIsLoading(false);
            }
          } catch (err: any) {
            setPluginInstallError('Install failed: ' + (err.shortMessage || err.message || String(err)));
            setIsLoading(false);
          }
        })();
      } else if (input.toLowerCase() === 'n') {
        setAwaitingPluginInstall(false);
        setPluginInstallError(null);
      } else if (input.toLowerCase() === 'q') {
        onComplete('failed_dependency');
      }
    }
  }, { isActive: subStep === 1 && awaitingPluginInstall && !isLoading });

  // Handle install prompt for @types/node
  useInput((input, key) => {
    if (subStep === 2 && awaitingTypesInstall && !isLoading) {
      if (input.toLowerCase() === 'y') {
        setIsLoading(true);
        setTypesInstallError(null);
        (async () => {
          try {
            await execa(installCommand, { stdio: 'inherit', shell: true });
            // After install, re-check
            const typesOk = await checkTypesNode();
            if (typesOk) {
              setTypesCheckPassed(true);
              setIsLoading(false);
              setAwaitingTypesInstall(false);
              setWaitingForTypesContinue(true);
            } else {
              setTypesInstallError('Install completed, but @types/node still not found.');
              setIsLoading(false);
            }
          } catch (err: any) {
            setTypesInstallError('Install failed: ' + (err.shortMessage || err.message || String(err)));
            setIsLoading(false);
          }
        })();
      } else if (input.toLowerCase() === 'n') {
        setAwaitingTypesInstall(false);
        setTypesInstallError(null);
      } else if (input.toLowerCase() === 'q') {
        onComplete('failed_dependency');
      }
    }
  }, { isActive: subStep === 2 && awaitingTypesInstall && !isLoading });

  // Retry/quit for each part
  useInput((input, key) => {
    if (finalResult === 'failed_dependency' && !isLoading) {
      if (input.toLowerCase() === 'r') {
        setFinalResult(null);
        setPromptMessage(null);
        setSubStep(subStep); // re-run current substep
      } else if (input.toLowerCase() === 'q') {
        onComplete('failed_dependency');
      }
    } else if (finalResult === 'failed_config' && !isLoading) {
      if (input.toLowerCase() === 'r') {
        setFinalResult(null);
        setPromptMessage(null);
        setSubStep(subStep); // re-run current substep
      } else if (input.toLowerCase() === 'q') {
        onComplete('failed_config');
      }
    }
  });

  // Config step: copy and recheck
  useInput((input, key) => {
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
  }, { isActive: showConfigHelp });

  // Format config file path for cross-platform clarity
  const formattedConfigFilePath = configFilePath.replace(/\\/g, '/');

  // --- Render logic for each part ---
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="yellow" bold>
          Step {stepIndex + 1} of {totalSteps}, substep {subStep} of 3
        </Text>
      </Box>
      <Text bold>--- Step 2: Babel Plugin ---</Text>
      {subStep === 1 && (
        <>
          <Box>
            <Text color={depCheckPassed ? 'green' : pluginInstallError ? 'red' : 'yellow'}>
              {isLoading ? <Spinner type="dots" /> : depCheckPassed ? '✔' : pluginInstallError ? '✖' : '○'}{' '}
              {depCheckPassed ? '@lucidlayer/babel-plugin-traceform is installed in package.json.' : status}
            </Text>
          </Box>
          {depCheckPassed && waitingForDepContinue && (
            <Text color="cyan">Press Enter to continue...</Text>
          )}
          {awaitingPluginInstall && !isLoading && !depCheckPassed && !pluginInstallError && (
            <Text color="yellow">@lucidlayer/babel-plugin-traceform not found in package.json. Would you like to install it now? (y/n, Q to quit)</Text>
          )}
          {pluginInstallError && !isLoading && (
            <Text color="red">{pluginInstallError}</Text>
          )}
          {!awaitingPluginInstall && !depCheckPassed && !isLoading && (
            <Box flexDirection="column" marginTop={1}>
              <Text color="yellow">To continue, open a new terminal and run:</Text>
              <Text color="cyan">  {installCommand}</Text>
              <Text color="yellow">After installing, return here and press R to retry, or Q to quit.</Text>
            </Box>
          )}
        </>
      )}
      {subStep === 2 && (
        <>
          <Box>
            <Text color={typesCheckPassed ? 'green' : typesInstallError ? 'red' : 'yellow'}>
              {isLoading ? <Spinner type="dots" /> : typesCheckPassed ? '✔' : typesInstallError ? '✖' : '○'}{' '}
              {typesCheckPassed ? '@types/node is installed in devDependencies.' : status}
            </Text>
          </Box>
          {typesCheckPassed && waitingForTypesContinue && (
            <Text color="cyan">Press Enter to continue...</Text>
          )}
          {awaitingTypesInstall && !isLoading && !typesCheckPassed && !typesInstallError && (
            <Text color="yellow">@types/node not found in devDependencies. Would you like to install it now? (y/n, Q to quit)</Text>
          )}
          {typesInstallError && !isLoading && (
            <Text color="red">{typesInstallError}</Text>
          )}
          {!awaitingTypesInstall && !typesCheckPassed && !isLoading && (
            <Box flexDirection="column" marginTop={1}>
              <Text color="yellow">To continue, open a new terminal and run:</Text>
              <Text color="cyan">  {installCommand}</Text>
              <Text color="yellow">After installing, return here and press R to retry, or Q to quit.</Text>
            </Box>
          )}
        </>
      )}
      {subStep === 3 && (
        <>
          <Box>
            <Text color={configCheckPassed ? 'green' : finalResult ? 'red' : 'yellow'}>
              {isLoading ? <Spinner type="dots" /> : configCheckPassed ? '✔' : finalResult ? '✖' : '○'}{' '}
              {configCheckPassed ? '@lucidlayer/babel-plugin-traceform is configured correctly.' : status}
            </Text>
          </Box>
          {showConfigHelp && !configCheckPassed && (
            <Box flexDirection="column" marginTop={1}>
              <Text color="red" bold>✖ Traceform Babel plugin is not yet configured!</Text>
              <Text>
                <Text color="yellow" bold>1.</Text> Open this file: <Link url={`file://${formattedConfigFilePath}`}>{formattedConfigFilePath}</Link>
              </Text>
              <Text>
                <Text color="yellow" bold>2.</Text> Copy and paste the following snippet for <Text color="magenta">DEVELOPMENT</Text> builds:
              </Text>
              <Text color="gray">----------------------------------------</Text>
              <Box marginY={1} paddingLeft={2} flexDirection="column">
                {configSnippet.split('\n').map((line, i) => (
                  <Text key={i}>{line}</Text>
                ))}
              </Box>
              <Text color="gray">----------------------------------------</Text>
              <Text color="magenta" bold>Press C to copy the code snippet to your clipboard.</Text>
              {copied && <Text color="green">Code snippet copied to clipboard!</Text>}
              <Box marginTop={1} flexDirection="column">
                <Text color="yellow" bold>What to do next:</Text>
                <Text color="yellow">- Update your config file as shown above.</Text>
                <Text color="yellow">- Press R to retry, or Q to quit.</Text>
              </Box>
            </Box>
          )}
          {finalResult === 'failed_config' && !isLoading && !showConfigHelp && (
            <Text color="red">Babel plugin is not configured. Add the snippet above and press R to recheck, or Q to quit.</Text>
          )}
          {configCheckPassed && waitingForConfigContinue && (
            <Text color="cyan">Press Enter to continue...</Text>
          )}
        </>
      )}
    </Box>
  );
};

export default BabelStep;
