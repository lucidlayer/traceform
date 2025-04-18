import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import Link from 'ink-link'; // For clickable links in supported terminals

interface VSCodeStepProps {
  onComplete: (success: boolean) => void;
}

const VSCodeStep: React.FC<VSCodeStepProps> = ({ onComplete }) => {
  const [isWaitingForConfirm, setIsWaitingForConfirm] = useState(true);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    const prompt = async () => {
      const inquirer = (await import('inquirer')).default;
      const { confirmed: userConfirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'Have you installed and enabled the Traceform VS Code extension?',
          default: false,
        },
      ]);
      setConfirmed(userConfirmed);
      setIsWaitingForConfirm(false);
      onComplete(userConfirmed);
    };
    void prompt();
  }, [onComplete]);

  return (
    <Box flexDirection="column"><Text bold>--- Step 3: VS Code Extension ---</Text><Text color="yellow">Ensure the "Traceform" VS Code extension is installed and enabled.</Text><Link url="https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode"><Text color="cyan">  Marketplace Link</Text></Link><Newline />{isWaitingForConfirm && <Text color="yellow">Waiting for confirmation...</Text>}{confirmed === true && <Text color="green">✔ VS Code Extension step confirmed.</Text>}{confirmed === false && <Text color="red">✖ Please install/enable the VS Code extension and restart the wizard.</Text>}</Box>
  );
};

export default VSCodeStep;
