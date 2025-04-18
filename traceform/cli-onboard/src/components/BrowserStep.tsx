import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import Link from 'ink-link'; // For clickable links

interface BrowserStepProps {
  onComplete: (success: boolean) => void;
}

const BrowserStep: React.FC<BrowserStepProps> = ({ onComplete }) => {
  const [isWaitingForConfirm, setIsWaitingForConfirm] = useState(true);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  // Placeholder for the actual guide link
  const guideLink = "https://github.com/lucidlayer/traceform/blob/main/traceform/browser-extension/README.md#installation"; // Example link

  useEffect(() => {
    const prompt = async () => {
      const inquirer = (await import('inquirer')).default;
      const { confirmed: userConfirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'Have you installed and enabled the Traceform Browser extension?',
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
    <Box flexDirection="column">
      <Text bold>--- Step 4: Browser Extension ---</Text>
      <Text color="yellow">Install the Traceform browser extension manually.</Text>
      <Link url="https://github.com/lucidlayer/traceform/releases">
        <Text color="cyan">  Download Link (Latest Release .zip)</Text>
      </Link>
      <Link url={guideLink}>
        <Text color="cyan">  Detailed Installation Guide</Text>
      </Link>
      <Newline />
      {isWaitingForConfirm && <Text color="yellow">Waiting for confirmation...</Text>}
      {confirmed === true && <Text color="green">✔ Browser Extension step confirmed.</Text>}
      {confirmed === false && <Text color="red">✖ Please install/enable the Browser extension and restart the wizard.</Text>}
    </Box>
  );
};

export default BrowserStep;
