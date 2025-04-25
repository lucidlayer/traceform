/*
// SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import { createTraceformError, handleTraceformError } from '../../../shared/src/traceformError';

interface ValidateStepProps {
  onComplete: (success: boolean) => void;
  stepIndex: number;
  totalSteps: number;
}

const ValidateStep: React.FC<ValidateStepProps> = ({ onComplete, stepIndex, totalSteps }) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    // Print checklist to console before exiting
    const timer = setTimeout(() => {
      try {
        process.exit(0);
      } catch (error) {
        // Use TraceformError for process exit error
        const err = createTraceformError(
          'TF-VA-001',
          'Error during process exit in ValidateStep',
          error,
          'validateStep.exit.error',
          false // not critical for telemetry
        );
        handleTraceformError(err, 'ValidateStep'); // @ErrorFeedback
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box flexDirection="column">
      <Text color="cyan">Step {stepIndex} of {totalSteps}</Text>
      <Text bold>--- Step 5: Final Validation ---</Text>
      <Text color="yellow">Checklist to validate your Traceform setup:</Text>
      <Text>1. Start your React dev server (e.g., npm run dev).</Text>
      <Text>2. Navigate to the sidebar to the Traceform VS Code extension and make sure the latest logs show <Text color="green">client connected</Text>. If not, press <Text color="yellow">Restart</Text>.</Text>
      <Text>3. Open your app in the browser. (e.g., open <Text color="cyan">http://localhost:5173/</Text>)</Text>
      <Text>4. In VS Code, open a React component file. (e.g., <Text color="cyan">Demo-01\src\components\StockCard.tsx</Text>)</Text>
      <Text>5. Highlight and right-click the component name and select <Text color="yellow">'Traceform: Find Component in UI'</Text>.</Text>
      <Text>6. Check your browser for highlighted components.</Text>
      {confirmed === true && (
        <Text color="green" bold>🎉 Congratulations! Your Traceform setup is working correctly!</Text>
      )}
      {confirmed === false && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="red" bold>❌ Validation failed.</Text>
          <Text color="cyan">Troubleshooting Tips:</Text>
          <Text color="cyan">- Double-check all previous setup steps.</Text>
          <Text color="cyan">- Ensure the Babel plugin is active in your DEV build.</Text>
          <Text color="cyan">- Check the VS Code Traceform sidebar for errors.</Text>
          <Text color="cyan">- Check the browser extension's status.</Text>
          <Text color="cyan">- Try restarting VS Code and your browser.</Text>
        </Box>
      )}
    </Box>
  );
};

export default ValidateStep;
