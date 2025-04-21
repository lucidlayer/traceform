/*
// SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react'; // Add useEffect here
import { Box, Text, useApp, useInput } from 'ink';
// Import step components
import PrerequisitesStep from './components/PrerequisitesStep.js';
import BabelStep from './components/BabelStep.js'; // Import default component
import type { BabelCheckStatus } from './components/BabelStep.js'; // Import type separately
import VSCodeStep from './components/VSCodeStep.js';
import BrowserStep from './components/BrowserStep.js';
import ValidateStep from './components/ValidateStep.js';

type Step = 'prerequisites' | 'babel' | 'vscode' | 'browser' | 'validate' | 'done' | 'failed';

const MIN_WIDTH = 60;
const MIN_HEIGHT = 15;
const MAX_WIDTH = 120;

// Custom hook to track terminal dimensions
const useTerminalDimensions = () => {
  const getDimensions = () => ({
    columns: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  });
  const [dimensions, setDimensions] = useState(getDimensions());
  // Stable handler reference
  const handleResize = React.useCallback(() => {
    setDimensions(getDimensions());
  }, []);
  useEffect(() => {
    process.stdout.on('resize', handleResize);
    return () => {
      process.stdout.off('resize', handleResize);
    };
  }, [handleResize]);
  return dimensions;
};

const App: React.FC = () => {
  const { exit } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>('prerequisites');
  const [finalMessage, setFinalMessage] = useState<string | null>(null);
  const [finalMessageColor, setFinalMessageColor] = useState<string>('green');
  const [prereqCompleted, setPrereqCompleted] = useState(false);
  const [babelCompleted, setBabelCompleted] = useState(false);
  const [vscodeCompleted, setVscodeCompleted] = useState(false);
  const [browserCompleted, setBrowserCompleted] = useState(false);

  const { columns, rows } = useTerminalDimensions();
  const tooSmall = columns < MIN_WIDTH || rows < MIN_HEIGHT;

  // Removed the raw mode effect to let Ink handle input management

  // --- Step Completion Handlers ---
  const handlePrereqComplete = (success: boolean) => {
    setPrereqCompleted(true);
    setCurrentStep(success ? 'babel' : 'failed');
    if (!success) {
      setFinalMessage('❌ Prerequisites not met. Exiting.');
      setFinalMessageColor('red');
      setTimeout(() => { console.log('Exiting...'); process.exit(0); }, 1500);
    }
  };
  const handleBabelComplete = (status: BabelCheckStatus) => {
    setBabelCompleted(true);
    if (status === 'passed') {
      setCurrentStep('vscode');
    } else if (status === 'failed_dependency' || status === 'failed_config') {
      setFinalMessage('Onboarding cancelled.');
      setFinalMessageColor('yellow');
      setCurrentStep('failed');
      setTimeout(() => { console.log('Exiting...'); process.exit(0); }, 1500);
    }
  };
  const handleVSCodeComplete = (success: boolean) => {
    setVscodeCompleted(true);
    setCurrentStep(success ? 'browser' : 'failed');
    if (!success) {
      setFinalMessage('❌ VSCode extension setup failed. Exiting.');
      setFinalMessageColor('red');
      setTimeout(() => { console.log('Exiting...'); process.exit(0); }, 1500);
    }
  };
  const handleBrowserComplete = (success: boolean) => {
    setBrowserCompleted(true);
    setCurrentStep(success ? 'validate' : 'failed');
    if (!success) {
      setFinalMessage('❌ Browser setup failed. Exiting.');
      setFinalMessageColor('red');
      setTimeout(() => { console.log('Exiting...'); process.exit(0); }, 1500);
    }
  };
  const handleValidationComplete = (success: boolean) => {
    setCurrentStep(success ? 'done' : 'failed');
    setFinalMessage(success ? '🎉 All steps completed successfully!' : '❌ Validation failed. Exiting.');
    setFinalMessageColor(success ? 'green' : 'red');
    if (!success) setTimeout(() => { console.log('Exiting...'); process.exit(0); }, 1500);
  };

  const stepOrder: Step[] = ['prerequisites', 'babel', 'vscode', 'browser', 'validate'];
  const stepTitles: Record<Step, string> = {
    prerequisites: 'Prerequisites',
    babel: 'Babel Plugin',
    vscode: 'VS Code Extension',
    browser: 'Browser Extension',
    validate: 'Final Validation',
    done: '',
    failed: '',
  };
  const getStepIndex = (step: Step) => stepOrder.indexOf(step) + 1;
  const totalSteps = stepOrder.length;

  const renderStep = () => {
    const stepIndex = getStepIndex(currentStep);
    switch (currentStep) {
      case 'prerequisites':
        return <PrerequisitesStep onComplete={handlePrereqComplete} stepIndex={stepIndex} totalSteps={totalSteps} />;
      case 'babel':
        return <BabelStep onComplete={handleBabelComplete} stepIndex={stepIndex} totalSteps={totalSteps} />;
      case 'vscode':
        return <VSCodeStep onComplete={handleVSCodeComplete} stepIndex={stepIndex} totalSteps={totalSteps} />;
      case 'browser':
        return <BrowserStep onComplete={handleBrowserComplete} stepIndex={stepIndex} totalSteps={totalSteps} />;
      case 'validate':
        return <ValidateStep onComplete={handleValidationComplete} stepIndex={stepIndex} totalSteps={totalSteps} />;
      case 'done':
      case 'failed':
        return <Text color={finalMessageColor}>{finalMessage}</Text>;
      default:
        return <Text color="red">Internal error: Unknown step.</Text>;
    }
  };

  // Keep the app alive by listening for input when terminal is too small
  useInput(() => {}, { isActive: tooSmall });

  // Dummy state to force periodic re-render when terminal is too small
  const [dummyTick, setDummyTick] = useState(0);
  useEffect(() => {
    if (tooSmall) {
      const timer = setInterval(() => {
        setDummyTick(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [tooSmall]);

  const [shouldRenderWizard, setShouldRenderWizard] = useState(!tooSmall);
  useEffect(() => {
    if (!tooSmall) {
      const timer = setTimeout(() => {
        setShouldRenderWizard(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShouldRenderWizard(false);
    }
  }, [tooSmall]);

  return (
    <Box
      borderStyle="round"
      padding={1}
      flexDirection="column"
      width={columns < MAX_WIDTH ? columns : MAX_WIDTH}
      height={rows >= 2 ? rows - 1 : rows}
      alignItems="center"
      justifyContent="center"
    >
      {!shouldRenderWizard ? (
        <Box flexDirection="column" alignItems="center" justifyContent="center">
          <Text color="red">
            Terminal too small for wizard. Please resize to at least {MIN_WIDTH}x{MIN_HEIGHT} to continue.
          </Text>
          <Text color="yellow">
            (The wizard will resume automatically when the terminal is large enough.)
          </Text>
        </Box>
      ) : (
        <>
          <Box marginBottom={1} justifyContent="center">
            <Text bold color="cyan">🚀 Traceform Onboarding Wizard 🚀</Text>
          </Box>
          <Box>{renderStep()}</Box>
        </>
      )}
    </Box>
  );
};

export default App;
