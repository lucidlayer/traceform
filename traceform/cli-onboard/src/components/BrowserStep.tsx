import React, { useState } from 'react';
import { Box, Text, Newline, useInput } from 'ink';
import Link from 'ink-link'; // For clickable links

interface BrowserStepProps {
  onComplete: (success: boolean) => void;
}

const BrowserStep: React.FC<BrowserStepProps> = ({ onComplete }) => {
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

  return (
    <Box flexDirection="column">
      <Text bold>--- Step 4: Browser Extension ---</Text>
      <Text color="yellow">Install the Traceform Browser Extension manually.</Text>
      <Newline />
      <Text>Instructions:</Text>
      <Text>1. Download the latest release (.zip) from the link below.</Text>
      <Text>2. Extract the downloaded file to a folder of your choice.</Text>
      <Text>3. Open your browser and navigate to the extensions page (e.g., chrome://extensions for Chrome, about:addons for Firefox).</Text>
      <Text>4. Enable Developer Mode (if applicable).</Text>
      <Text>5. Click on "Load unpacked" (or the equivalent) and select the extracted folder.</Text>
      <Text>6. Ensure the extension is enabled.</Text>
      <Newline />
      <Link url="https://github.com/lucidlayer/traceform/releases">
        <Text color="cyan">Download Link (Latest Release .zip)</Text>
      </Link>
      <Newline />
      {confirmed === null && <Text color="yellow">Have you installed and enabled the browser extension? (Y/n)</Text>}
      {confirmed === true && <Text color="green">✔ Browser Extension step confirmed.</Text>}
      {confirmed === false && <Text color="red">✖ Browser Extension step not confirmed. Please install/enable the extension and restart the wizard.</Text>}
    </Box>
  );
};

export default BrowserStep;
