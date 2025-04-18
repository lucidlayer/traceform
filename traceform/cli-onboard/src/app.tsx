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

// Custom hook to track terminal dimensions
const useTerminalDimensions = () => {
  const [dimensions, setDimensions] = useState({ columns: process.stdout.columns, rows: process.stdout.rows });
  // Stable handler reference
  const handleResize = React.useCallback(() => {
    setDimensions({ columns: process.stdout.columns, rows: process.stdout.rows });
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

  useEffect(() => {
    if (!tooSmall) {
      console.clear();
    }
  }, [currentStep, columns, rows, tooSmall]);

  // --- Step Completion Handlers ---
  const handlePrereqComplete = (success: boolean) => {
    setPrereqCompleted(true);
    setCurrentStep(success ? 'babel' : 'failed');
    if (!success) {
      setFinalMessage('❌ Prerequisites not met. Exiting.');
      setFinalMessageColor('red');
    }
  };
  const handleBabelComplete = (status: BabelCheckStatus) => {
    setBabelCompleted(true);
    if (status === 'passed') {
      setCurrentStep('vscode');
    } else if (status === 'failed_dependency') {
      setFinalMessage('❌ Babel plugin dependency is missing or install failed. Exiting.');
      setFinalMessageColor('red');
      setCurrentStep('failed');
    } else if (status === 'failed_config') {
      setFinalMessage('❌ Babel plugin configuration is missing or incorrect. Exiting.');
      setFinalMessageColor('red');
      setCurrentStep('failed');
    }
  };
  const handleVSCodeComplete = (success: boolean) => {
    setVscodeCompleted(true);
    setCurrentStep(success ? 'browser' : 'failed');
    if (!success) {
      setFinalMessage('❌ VSCode extension setup failed. Exiting.');
      setFinalMessageColor('red');
    }
  };
  const handleBrowserComplete = (success: boolean) => {
    setBrowserCompleted(true);
    setCurrentStep(success ? 'validate' : 'failed');
    if (!success) {
      setFinalMessage('❌ Browser setup failed. Exiting.');
      setFinalMessageColor('red');
    }
  };
  const handleValidationComplete = (success: boolean) => {
    setCurrentStep(success ? 'done' : 'failed');
    setFinalMessage(success ? '🎉 All steps completed successfully!' : '❌ Validation failed. Exiting.');
    setFinalMessageColor(success ? 'green' : 'red');
  };

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
      case 'failed':
        return <Text color={finalMessageColor}>{finalMessage}</Text>;
      default:
        return <Text color="red">Internal error: Unknown step.</Text>;
    }
  };

  // Keep the app alive by listening for input when terminal is too small
  useInput(() => {}, { isActive: tooSmall });

  // Ensure process stays alive when terminal is too small
  useEffect(() => {
    if (tooSmall) {
      process.stdin.resume();
    }
  }, [tooSmall]);

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

  return (
    <Box
      borderStyle="round"
      padding={1}
      flexDirection="column"
      width={columns < 80 ? columns : 80}
      height={rows >= 2 ? rows - 1 : rows}
      alignItems="center"
      justifyContent="center"
    >
      {tooSmall ? (
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
          <Box key={`${columns}x${rows}`}>{renderStep()}</Box>
        </>
      )}
    </Box>
  );
};

export default App;
