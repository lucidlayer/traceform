/*
// SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';

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
      process.exit(0);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box flexDirection="column">
      <Text color="cyan">Step {stepIndex} of {totalSteps}</Text>
      <Text bold>--- Step 5: Final Validation ---</Text>
      <Text color="yellow">Checklist to validate your Traceform setup:</Text>
      <Text>1. Start your React dev server (e.g., npm run dev).</Text>
      <Text>2. Open your project in VS Code.</Text>
      <Text>3. Open your app in the browser with the extension enabled.</Text>
      <Text>4. In VS Code, open a React component file.</Text>
      <Text>5. Right-click the component name and select 'Traceform: Find Component in UI'.</Text>
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
