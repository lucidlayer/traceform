import React, { useState, useEffect } from 'react'; // Add useEffect here
import { Box, Text, useApp } from 'ink';
// Import step components
import PrerequisitesStep from './components/PrerequisitesStep.js';
import BabelStep from './components/BabelStep.js'; // Import default component
import type { BabelCheckStatus } from './components/BabelStep.js'; // Import type separately
import VSCodeStep from './components/VSCodeStep.js';
import BrowserStep from './components/BrowserStep.js';
import ValidateStep from './components/ValidateStep.js';

type Step = 'prerequisites' | 'babel' | 'vscode' | 'browser' | 'validate' | 'done' | 'failed';

const App: React.FC = () => {
  const { exit } = useApp(); // Hook to exit the Ink app
  const [currentStep, setCurrentStep] = useState<Step>('prerequisites');
  const [finalMessage, setFinalMessage] = useState<string | null>(null);
  const [finalMessageColor, setFinalMessageColor] = useState<string>('green');

  // State flags to manage transitions more explicitly
  const [prereqCompleted, setPrereqCompleted] = useState(false);
  const [babelCompleted, setBabelCompleted] = useState(false);
  const [vscodeCompleted, setVscodeCompleted] = useState(false);
  const [browserCompleted, setBrowserCompleted] = useState(false);
  // No flag needed for validate, as it's the last step before 'done'/'failed'

  // --- Step Completion Handlers ---

  const handlePrereqComplete = (success: boolean) => {
    if (success) {
      setPrereqCompleted(true); // Signal completion instead of changing step directly
    } else {
      setFinalMessage('Prerequisite checks failed. Please address the issues and restart.');
      setFinalMessageColor('red');
      setCurrentStep('failed');
      // exit(); // Let Ink handle exit or user Ctrl+C
    }
  };

  const handleBabelComplete = (status: BabelCheckStatus) => {
    if (status === 'passed') {
      setBabelCompleted(true); // Signal completion
    } else {
      setFinalMessage(`Babel setup ${status}. Cannot proceed. Please fix and restart.`);
      setFinalMessageColor('red');
      setCurrentStep('failed');
      // exit();
    }
  };

  const handleVSCodeComplete = (success: boolean) => {
    if (success) {
      setVscodeCompleted(true); // Signal completion
    } else {
      setFinalMessage('VS Code Extension step not confirmed. Please install/enable and restart.');
      setFinalMessageColor('yellow');
      setCurrentStep('failed');
      // exit();
    }
  };

  const handleBrowserComplete = (success: boolean) => {
    if (success) {
      setBrowserCompleted(true); // Signal completion
    } else {
      setFinalMessage('Browser Extension step not confirmed. Please install/enable and restart.');
      setFinalMessageColor('yellow');
      setCurrentStep('failed');
      // exit();
    }
  };

  const handleValidationComplete = (success: boolean) => {
    // Validation is the last step, directly set final state
    if (success) {
      setFinalMessage('🎉 Congratulations! Your Traceform setup is working correctly!');
      setFinalMessageColor('green');
    } else {
      setFinalMessage('Validation failed. Please review troubleshooting tips and restart if needed.');
      setFinalMessageColor('red');
    }
    setCurrentStep('done');
    // exit(); // Let Ink handle exit or user Ctrl+C
  };

  // --- Effects for Step Transitions ---
  useEffect(() => {
    if (prereqCompleted) {
      setCurrentStep('babel');
    }
  }, [prereqCompleted]);

  useEffect(() => {
    if (babelCompleted) {
      setCurrentStep('vscode');
    }
  }, [babelCompleted]);

  useEffect(() => {
    if (vscodeCompleted) {
      setCurrentStep('browser');
    }
  }, [vscodeCompleted]);

  useEffect(() => {
    if (browserCompleted) {
      // Only proceed if previous steps were implicitly successful to reach here
      setCurrentStep('validate');
    }
  }, [browserCompleted]);


  // --- Render Logic ---
  const renderStep = () => {
    switch (currentStep) {
      case 'prerequisites':
        return <PrerequisitesStep onComplete={handlePrereqComplete} />;
      case 'babel':
        return <BabelStep onComplete={handleBabelComplete} />;
      case 'vscode':
        return <VSCodeStep onComplete={handleVSCodeComplete} />;
      case 'browser':
        return <BrowserStep onComplete={handleBrowserComplete} />;
      case 'validate':
        return <ValidateStep onComplete={handleValidationComplete} />;
      case 'done':
      case 'failed': // Show final message in both 'done' and 'failed' states before exit
        return <Text color={finalMessageColor}>{finalMessage}</Text>;
      default:
        return <Text color="red">Internal error: Unknown step.</Text>;
    }
  };

  return (
    <Box borderStyle="round" padding={1} flexDirection="column" minWidth={80}>
      <Box marginBottom={1} justifyContent="center">
        <Text bold color="cyan">
          🚀 Traceform Onboarding Wizard 🚀
        </Text>
      </Box>
      {renderStep()}
    </Box>
  );
};

export default App;
