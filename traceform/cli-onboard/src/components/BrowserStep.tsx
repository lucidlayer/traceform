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
      if (key.return) {
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
      <Text color="yellow">Install the Traceform Browser Extension from the Chrome Web Store:</Text>
      <Text>1. Open the Chrome Web Store page</Text>
      <Text color="cyan">https://chromewebstore.google.com/detail/giidcepndnnabhfkopmgcnpnnilkaefa?utm_source=item-share-cb</Text>
      <Text>2. Click "Add to Chrome"</Text>
      {confirmed === null && <Text color="yellow">Press Enter to continue or Q to quit</Text>}
      {confirmed === true && <Text color="green">✔ Browser Extension step confirmed.</Text>}
      {confirmed === false && <Text color="red">✖ Browser Extension step not confirmed. Please install/enable the extension and restart the wizard.</Text>}
    </Box>
  );
};

export default BrowserStep;
