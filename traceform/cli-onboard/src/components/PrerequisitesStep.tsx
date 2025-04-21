/*
// SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';

interface PrerequisitesStepProps {
  onComplete: (success: boolean) => void;
  stepIndex: number;
  totalSteps: number;
}

// Simplified version check logic adapted for React state
async function checkCommandVersion(
  command: string,
  versionArg: string,
  minVersion: string
): Promise<{ passed: boolean; message: string; version?: string }> {
  try {
    const { execa } = await import('execa'); // Dynamic import
    const { stdout } = await execa(command, [versionArg]);
    const version = stdout.trim().replace(/^v/, '');
    const versionParts = version.split('.').map(Number);
    const minVersionParts = minVersion.split('.').map(Number);

    for (let i = 0; i < minVersionParts.length; i++) {
      // Handle cases like '18' vs '18.17.0' where versionParts might be shorter
      if (i >= versionParts.length || versionParts[i] < minVersionParts[i]) {
        return {
          passed: false,
          message: `Error: ${command} version ${version} is below the required minimum ${minVersion}. Please install or update.`,
          version,
        };
      }
      if (versionParts[i] > minVersionParts[i]) {
        return { passed: true, message: `${command} v${version} found.`, version };
      }
    }
    // If loops completes, versions are equal up to minVersionParts length, or versionParts is longer (e.g., 18.17.1 vs 18.17.0)
    return { passed: true, message: `${command} v${version} found.`, version };
  } catch (error) {
    return {
      passed: false,
      message: `Error: Couldn't run '${command}'. Is it installed and in your PATH?`,
    };
  }
}

const PrerequisitesStep: React.FC<PrerequisitesStepProps> = ({ onComplete, stepIndex, totalSteps }) => {
  const [nodeStatus, setNodeStatus] = useState<string | null>(null);
  const [pmStatus, setPmStatus] = useState<string | null>(null);
  const [nodePassed, setNodePassed] = useState<boolean | null>(null);
  const [pmPassed, setPmPassed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckComplete, setIsCheckComplete] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false); // State to indicate readiness for Enter key
  const [promptMessage, setPromptMessage] = useState<string | null>(null);

  // Effect to run the checks
  useEffect(() => {
    const runChecks = async () => {
      setIsLoading(true);
      setIsCheckComplete(false);
      setNodeStatus('Checking Node.js version...');
      const nodeResult = await checkCommandVersion('node', '-v', '18.17.0');
      setNodeStatus(nodeResult.message);
      setNodePassed(nodeResult.passed);

      if (!nodeResult.passed) {
        setPmStatus('Skipped (Node.js check failed)');
        setPmPassed(false);
        setIsLoading(false);
        setIsCheckComplete(true);
        return;
      }

      setPmStatus('Checking for package manager (npm, yarn, or pnpm)...');
      let packageManagerFound = false;
      let pmMessage = '';
      let pmFound = null; // Store which PM was found

      // Check npm
      const npmResult = await checkCommandVersion('npm', '-v', '8.0.0');
      if (npmResult.passed) {
        packageManagerFound = true;
        pmMessage = `npm v${npmResult.version} found.`;
        pmFound = 'npm';
      }

      // Check yarn only if npm wasn't found
      if (!packageManagerFound) {
        const yarnResult = await checkCommandVersion('yarn', '-v', '1.22.0');
        if (yarnResult.passed) {
          packageManagerFound = true;
          pmMessage = `yarn v${yarnResult.version} found.`;
          pmFound = 'yarn';
        }
      }

      // Check pnpm only if npm and yarn weren't found
      if (!packageManagerFound) {
        const pnpmResult = await checkCommandVersion('pnpm', '-v', '7.0.0');
        if (pnpmResult.passed) {
          packageManagerFound = true;
          pmMessage = `pnpm v${pnpmResult.version} found.`;
          pmFound = 'pnpm';
        }
      }

      if (!packageManagerFound) {
        setPmStatus('Error: No supported package manager found (npm >= 8, yarn >= 1.22, pnpm >= 7). Please install or update.');
        setPmPassed(false);
      } else {
        setPmStatus(`Package manager check passed (${pmMessage})`);
        setPmPassed(true);
      }

      setIsLoading(false);
      setIsCheckComplete(true);
    };

    void runChecks();
  }, []); // Run only once on mount

  // Effect to trigger continue prompt or call onComplete on failure
  useEffect(() => {
    if (isCheckComplete && !isLoading) {
      const success = nodePassed === true && pmPassed === true;
      if (success) {
        setShowContinuePrompt(true); // Enable listening for Enter
        setPromptMessage('Press Enter to continue...'); // Set prompt message
      } else {
        // If checks failed, call onComplete immediately
        onComplete(false);
      }
    }
    // Intentionally not including onComplete in dependencies to avoid potential loops if parent re-renders
  }, [isCheckComplete, isLoading, nodePassed, pmPassed]);

  // Input handler for continuing
  useInput(
    (input, key) => {
      if (showContinuePrompt && key.return) {
        // Check if the prompt is active and Enter key was pressed
        setShowContinuePrompt(false); // Disable prompt
        setPromptMessage(null); // Clear message
        onComplete(true); // Signal success
        return; // Prevent event from propagating
      }
    },
    { isActive: showContinuePrompt } // Only activate the hook when the prompt should be shown
  );

  // Add universal quit handler
  useInput((input, key) => {
    if (input.toLowerCase() === 'q') {
      onComplete(false);
      return;
    }
  });

  const getStatusColor = (passed: boolean | null): string => {
    if (passed === null) return 'yellow';
    return passed ? 'green' : 'red';
  };

  const getStatusIcon = (passed: boolean | null): string => {
     if (isLoading && passed === null) return ''; // Handled by spinner text below
     if (passed === null) return '○'; // Still waiting or skipped
     return passed ? '✔' : '✖';
  };

  return (
    <Box flexDirection="column">
      <Text color="cyan">Step {stepIndex} of {totalSteps}</Text>
      <Text bold>--- Step 1: Prerequisites ---</Text>
      <Box>
         <Text color={getStatusColor(nodePassed)}>
           {isLoading && nodeStatus?.startsWith('Checking') ? <Spinner type="dots" /> : getStatusIcon(nodePassed)}{` ${nodeStatus ?? 'Waiting...'}`}
         </Text>
      </Box>
      <Box>
         <Text color={getStatusColor(pmPassed)}>
           {isLoading && nodePassed && pmStatus?.startsWith('Checking') ? <Spinner type="dots" /> : getStatusIcon(pmPassed)}{` ${pmStatus ?? 'Waiting...'}`}
         </Text>
      </Box>
      {/* Failure Message */}
      {!isLoading && isCheckComplete && !(nodePassed && pmPassed) && (
        <Box marginTop={1}>
          <Text color="red">Prerequisite checks failed. Please address the issues above and restart the wizard.</Text>
        </Box>
      )}
      {/* Success Message & Prompt */}
      {promptMessage && (
        <Box marginTop={1}>
           <Text color="cyan">{promptMessage} (Q to quit)</Text>
        </Box>
      )}
    </Box>
  );
};

export default PrerequisitesStep;
