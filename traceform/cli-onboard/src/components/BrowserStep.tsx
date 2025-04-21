/*
// SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Box, Text, Newline, useInput } from 'ink';
import Link from 'ink-link'; // For clickable links

interface BrowserStepProps {
  onComplete: (success: boolean) => void;
  stepIndex: number;
  totalSteps: number;
}

const BrowserStep: React.FC<BrowserStepProps> = ({ onComplete, stepIndex, totalSteps }) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false);

  // Removed detailed installation guide link; instructions are provided inline now.

  // Use Ink's useInput hook for confirmation
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

  // Add universal quit handler
  useInput((input, key) => {
    if (input.toLowerCase() === 'q') {
      onComplete(false);
      return;
    }
  });

  return (
    <Box flexDirection="column">
      <Text color="cyan">Step {stepIndex} of {totalSteps}</Text>
      <Text bold>--- Step 4: Browser Extension ---</Text>
      <Text color="yellow">Install the Traceform Browser Extension manually.</Text>
      <Text>1. Download the latest release (.zip) from:</Text>
      <Text color="cyan">https://github.com/lucidlayer/traceform/releases</Text>
      <Text>2. Extract the file and load it as an unpacked extension in your browser.</Text>
      <Text>3. Enable the extension.</Text>
      {confirmed === null && <Text color="yellow">Have you installed and enabled the browser extension? (Y/n, Q to quit)</Text>}
      {confirmed === true && <Text color="green">✔ Browser Extension step confirmed.</Text>}
      {confirmed === false && <Text color="red">✖ Browser Extension step not confirmed. Please install/enable the extension and restart the wizard.</Text>}
    </Box>
  );
};

export default BrowserStep;
