/*
// SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';

interface ValidateStepProps {
  onComplete: (success: boolean) => void; // Or maybe just signal completion?
}

const ValidateStep: React.FC<ValidateStepProps> = ({ onComplete }) => {
  const [isWaitingForConfirm, setIsWaitingForConfirm] = useState(true);
  const [worked, setWorked] = useState<boolean | null>(null);

  useEffect(() => {
    const prompt = async () => {
      const inquirer = (await import('inquirer')).default;
      const { worked: userConfirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'worked',
          message: 'Did the component highlighting work correctly in the browser?',
          default: false,
        },
      ]);
      setWorked(userConfirmed);
      setIsWaitingForConfirm(false);
      onComplete(userConfirmed); // Signal completion and success/failure
    };
    void prompt();
  }, [onComplete]);

  return (
    <Box flexDirection="column">
      <Text bold>--- Step 5: Final Validation ---</Text>
      <Text color="yellow">Please follow these steps to validate your Traceform setup:</Text>
      <Newline />
      {[
        '1. Ensure your React development server is running.',
        '   (e.g., `npm run dev`, `yarn dev`, `pnpm dev`)',
        '2. Open your project folder in VS Code.',
        '3. Open your running application in the browser where you installed the Traceform extension.',
        '   (Make sure the extension is enabled!)',
        '4. In VS Code, open a file containing a React component definition.',
        '   (e.g., `src/components/Button.tsx`)',
        '5. Right-click on the component name (e.g., `Button`).',
        '6. Select "Traceform: Find Component in UI" from the context menu.',
        '7. Check your browser. Did the instances of that component get highlighted?',
      ].map((line, i) => <Text key={i} color={i === 9 ? 'yellow' : undefined}>{line}</Text>)}
      <Newline />
      {isWaitingForConfirm && <Text color="yellow">Press Enter to continue...</Text>}
      {worked === true && (
        <Text color="green" bold>
          <Newline />🎉 Congratulations! Your Traceform setup is working correctly!
        </Text>
      )}
      {worked === false && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="red" bold>❌ Validation failed.</Text>
          <Text color="cyan">Troubleshooting Tips:</Text>
          {[
            '- Double-check all previous setup steps (VS Code ext enabled, Babel plugin config correct, Browser ext enabled).',
            '- Ensure the Babel plugin is active in your DEV build (check terminal output).',
            '- Check the VS Code Traceform sidebar for connection status/errors.',
            "- Check the browser extension's service worker status (see `chrome://extensions`).",
            '- Consult the troubleshooting sections in the README files.',
            '- Try restarting VS Code and your browser.',
          ].map((tip, i) => <Text key={i} color="cyan">  {tip}</Text>)}
        </Box>
      )}
    </Box>
  );
};

export default ValidateStep;
