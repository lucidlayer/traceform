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
    <Box flexDirection="column"><Text bold>--- Step 5: Final Validation ---</Text><Text color="yellow">Please follow these steps to validate your Traceform setup:</Text><Text>  1. Ensure your React development server is running.</Text><Text>     (e.g., `npm run dev`, `yarn dev`, `pnpm dev`)</Text><Text>  2. Open your project folder in VS Code.</Text><Text>  3. Open your running application in the browser where you installed the Traceform extension.</Text><Text>     (Make sure the extension is enabled!)</Text><Text>  4. In VS Code, open a file containing a React component definition.</Text><Text>     (e.g., `src/components/Button.tsx`)</Text><Text>  5. Right-click on the component name (e.g., `Button`).</Text><Text>  6. Select "Traceform: Find Component in UI" from the context menu.</Text><Text color="yellow">  7. Check your browser. Did the instances of that component get highlighted?</Text><Newline />{isWaitingForConfirm && <Text color="yellow">Press Enter to continue...</Text>}{worked === true && (<Text color="green" bold><Newline />🎉 Congratulations! Your Traceform setup is working correctly!</Text>)}{worked === false && (<Box flexDirection="column" marginTop={1}><Text color="red" bold>❌ Validation failed.</Text><Text color="cyan">  Troubleshooting Tips:</Text><Text color="cyan">  - Double-check all previous setup steps (VS Code ext enabled, Babel plugin config correct, Browser ext enabled).</Text><Text color="cyan">  - Ensure the Babel plugin is active in your DEV build (check terminal output).</Text><Text color="cyan">  - Check the VS Code Traceform sidebar for connection status/errors.</Text><Text color="cyan">  - Check the browser extension's service worker status (see `chrome://extensions`).</Text><Text color="cyan">  - Consult the troubleshooting sections in the README files.</Text><Text color="cyan">  - Try restarting VS Code and your browser.</Text></Box>)}</Box>
  );
};

export default ValidateStep;
