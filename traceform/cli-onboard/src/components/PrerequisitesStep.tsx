import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface PrerequisitesStepProps {
  onComplete: (success: boolean) => void;
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
      if (versionParts[i] > minVersionParts[i]) {
        return { passed: true, message: `${command} v${version} found.`, version };
      }
      if (versionParts[i] < minVersionParts[i]) {
        return {
          passed: false,
          message: `Error: ${command} version ${version} is below the required minimum ${minVersion}. Please install or update.`,
          version,
        };
      }
    }
    return { passed: true, message: `${command} v${version} found.`, version }; // Versions are equal or version has more parts
  } catch (error) {
    return {
      passed: false,
      message: `Error: Couldn't run '${command}'. Is it installed and in your PATH?`,
    };
  }
}

const PrerequisitesStep: React.FC<PrerequisitesStepProps> = ({ onComplete }) => {
  const [nodeStatus, setNodeStatus] = useState<string | null>(null);
  const [pmStatus, setPmStatus] = useState<string | null>(null);
  const [nodePassed, setNodePassed] = useState<boolean | null>(null);
  const [pmPassed, setPmPassed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckComplete, setIsCheckComplete] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false); // New state for prompt
  const [promptMessage, setPromptMessage] = useState<string | null>(null); // State for prompt message

  // Effect to run the checks
  useEffect(() => {
    const runChecks = async () => {
      setIsLoading(true);
      setIsCheckComplete(false); // Reset completion state
      setNodeStatus('Checking Node.js version...');
      const nodeResult = await checkCommandVersion('node', '-v', '18.17.0');
      // Update state immediately after check
      setNodeStatus(nodeResult.message);
      setNodePassed(nodeResult.passed);

      if (!nodeResult.passed) {
        setPmStatus('Skipped (Node.js check failed)');
        setPmPassed(false);
        setIsLoading(false);
        setIsCheckComplete(true); // Mark check as complete (failed)
        // onComplete(false); // Don't call onComplete here yet
        return;
      }

      setPmStatus('Checking for package manager (npm, yarn, or pnpm)...');
      let packageManagerFound = false;
      let pmMessage = '';

      // Check npm
      const npmResult = await checkCommandVersion('npm', '-v', '8.0.0');
      if (npmResult.passed) {
        packageManagerFound = true;
        pmMessage = `npm v${npmResult.version} found.`;
      }

      // Check yarn only if npm wasn't found
      if (!packageManagerFound) {
        const yarnResult = await checkCommandVersion('yarn', '-v', '1.22.0');
        if (yarnResult.passed) {
          packageManagerFound = true;
          pmMessage = `yarn v${yarnResult.version} found.`;
        }
      }

      // Check pnpm only if npm and yarn weren't found
      if (!packageManagerFound) {
        const pnpmResult = await checkCommandVersion('pnpm', '-v', '7.0.0');
        if (pnpmResult.passed) {
          packageManagerFound = true;
          pmMessage = `pnpm v${pnpmResult.version} found.`;
        }
      }

      if (!packageManagerFound) {
        setPmStatus('Error: No supported package manager found. Please install npm, yarn, or pnpm.');
        setPmPassed(false);
      } else {
        setPmStatus(`Package manager check passed (${pmMessage})`);
        setPmPassed(true);
      }

      setIsLoading(false);
      setIsCheckComplete(true); // Mark check as complete (passed or failed PM check)
      // Don't call onComplete here
    };

    void runChecks();
  }, []); // Run only once on mount

  // Effect to trigger continue prompt or call onComplete on failure
  useEffect(() => {
    if (isCheckComplete && !isLoading) {
      const success = nodePassed === true && pmPassed === true;
      if (success) {
        // Don't call onComplete yet, trigger the prompt instead
        setShowContinuePrompt(true);
      } else {
        // If checks failed, call onComplete immediately
        onComplete(false);
      }
    }
  }, [isCheckComplete, isLoading, nodePassed, pmPassed]); // Removed onComplete dependency here

  // Effect to handle the continue prompt
  useEffect(() => {
    if (showContinuePrompt) {
      const prompt = async () => {
        setPromptMessage('Waiting for confirmation...'); // Show waiting message
        const inquirer = (await import('inquirer')).default;
        const { proceed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Prerequisites passed. Proceed to next step?',
            default: true,
          },
        ]);
        setPromptMessage(null); // Clear waiting message
        setShowContinuePrompt(false); // Hide prompt trigger
        onComplete(proceed); // Call onComplete with user's choice
      };
      void prompt();
    }
  }, [showContinuePrompt, onComplete]);

  const getStatusColor = (passed: boolean | null): string => {
    if (passed === null) return 'yellow';
    return passed ? 'green' : 'red';
  };

  return (
    <Box flexDirection="column"><Text bold>--- Step 1: Prerequisites ---</Text><Box><Text color={getStatusColor(nodePassed)}>{nodeStatus === null && isLoading ? <Spinner type="dots" /> : (nodePassed === null ? "○" : nodePassed ? "✔" : "✖")}{` ${nodeStatus ?? "Waiting..."}`}</Text></Box><Box><Text color={getStatusColor(pmPassed)}>{pmStatus === null && isLoading ? <Spinner type="dots" /> : (pmPassed === null ? "○" : pmPassed ? "✔" : "✖")}{` ${pmStatus ?? "Waiting..."}`}</Text></Box>{!isLoading && !(nodePassed && pmPassed) && (<Box marginTop={1}><Text color="red">Prerequisite checks failed. Please address the issues above and restart the wizard.</Text></Box>)}{!isLoading && nodePassed && pmPassed && !showContinuePrompt && (<Box marginTop={1}><Text color="green">Prerequisites passed.</Text></Box>)}{promptMessage && <Text color="yellow">{promptMessage}</Text>}</Box>
  );
};

export default PrerequisitesStep;
