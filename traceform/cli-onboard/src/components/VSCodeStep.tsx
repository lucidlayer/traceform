import React, { useState } from 'react';
import { Box, Text, Newline, useInput } from 'ink';
import Link from 'ink-link'; // For clickable links in supported terminals

interface VSCodeStepProps {
  onComplete: (success: boolean) => void;
}

const VSCodeStep: React.FC<VSCodeStepProps> = ({ onComplete }) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false); // to avoid repeated answers

  // Use Ink's useInput hook to handle user response
  useInput((input, key) => {
    if (!answered && confirmed === null) {
      // Treat 'n' input as no; 'y' or Enter as yes
      if (input.toLowerCase() === 'n') {
        setConfirmed(false);
        setAnswered(true);
        onComplete(false);
      } else if (input.toLowerCase() === 'y' || key.return) {
        setConfirmed(true);
        setAnswered(true);
        onComplete(true);
      }
    }
  }, { isActive: confirmed === null });

  return (
    <Box flexDirection="column">
      <Text bold>--- Step 3: VS Code Extension ---</Text>
      <Text color="yellow">Install the Traceform VS Code extension:</Text>
      <Text>1. Open VS Code.</Text>
      <Text>2. Click the Extensions icon in the Activity Bar (or press <Text bold>Ctrl+Shift+X</Text>).</Text>
      <Text>3. In the search box, type: <Text bold>Traceform</Text></Text>
      <Text>4. Find <Text bold>Traceform for VS Code</Text> by LucidLayer and click <Text bold>Install</Text>.</Text>
      <Text>5. Or, open the extension in your browser:</Text>
      <Box flexDirection="column" marginLeft={2}>
        <Text color="cyan">Traceform for VS Code Extension (Marketplace)</Text>
        <Text color="gray" wrap="wrap">https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode</Text>
      </Box>
      <Newline />
      {confirmed === null && <Text color="yellow">Have you installed the VS Code extension? (Y/n)</Text>}
      {confirmed === true && <Text color="green">✔ VS Code Extension step confirmed.</Text>}
      {confirmed === false && <Text color="red">✖ VS Code Extension step not confirmed.</Text>}
    </Box>
  );
};

export default VSCodeStep;
