// SPDX-License-Identifier: Apache-2.0
/*
// SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Box, Text, Newline, useInput } from 'ink';
import Link from 'ink-link'; // For clickable links in supported terminals

interface VSCodeStepProps {
  onComplete: (success: boolean) => void;
  stepIndex: number;
  totalSteps: number;
}

const VSCodeStep: React.FC<VSCodeStepProps> = ({ onComplete, stepIndex, totalSteps }) => {
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
      <Text color="cyan">Step {stepIndex} of {totalSteps}</Text>
      <Text bold>--- Step 3: VS Code Extension ---</Text>
      <Text color="yellow">Install the Traceform VS Code extension:</Text>
      <Text>1. Open VS Code.</Text>
      <Text>2. Go to Extensions (Ctrl+Shift+X).</Text>
      <Text>3. Search for <Text bold>Traceform</Text> and install it.</Text>
      <Text>4. Or visit: https://marketplace.visualstudio.com/items?itemName=LucidLayer.traceform-vscode</Text>
      {confirmed === null && <Text color="yellow">Have you installed the VS Code extension? (Y/n)</Text>}
      {confirmed === true && <Text color="green">✔ VS Code Extension step confirmed.</Text>}
      {confirmed === false && <Text color="red">✖ VS Code Extension step not confirmed.</Text>}
    </Box>
  );
};

export default VSCodeStep;
