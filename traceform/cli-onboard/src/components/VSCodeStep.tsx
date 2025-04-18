import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import Link from 'ink-link'; // For clickable links in supported terminals

interface VSCodeStepProps {
  onComplete: (success: boolean) => void;
}

const VSCodeStep: React.FC<VSCodeStepProps> = ({ onComplete }) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [prompted, setPrompted] = useState(false);

  useEffect(() => {
    if (prompted) return;
    setPrompted(true);
    const prompt = async () => {
      const inquirerModule = await import('inquirer');
      const inquirer = (inquirerModule.default || inquirerModule) as any;
      const { confirmed: userConfirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'Have you installed the Traceform VS Code extension?',
          default: true,
        },
      ]);
      setConfirmed(userConfirmed);
      if (userConfirmed) {
        onComplete(true);
      } else {
        onComplete(false);
      }
    };
    void prompt();
  }, [onComplete, prompted]);

  return (
    <Box flexDirection="column">
      <Text bold>--- Step 3: VS Code Extension ---</Text>
      <Text color="yellow">Install the Traceform VS Code extension:</Text>
      <Text>1. Open VS Code.</Text>
      <Text>2. Click the Extensions icon in the Activity Bar (or press <Text bold>Ctrl+Shift+X</Text>).</Text>
      <Text>3. In the search box, type: <Text bold>Traceform</Text></Text>
      <Text>4. Find <Text bold>Traceform for VS Code</Text> by LucidLayer and click <Text bold>Install</Text>.</Text>
      <Text>5. Or, open the extension in your browser:</Text>
      <Link url="https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode">
        <Text color="cyan">  Traceform for VS Code Extension (Marketplace)</Text>
      </Link>
      <Newline />
      {confirmed === null && <Text color="yellow">Waiting for confirmation...</Text>}
      {confirmed === true && <Text color="green">✔ VS Code Extension step confirmed.</Text>}
    </Box>
  );
};

export default VSCodeStep;
