import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box } from '@chakra-ui/react';

interface AlertBannerProps {
  status?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  description?: string;
  onClose?: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ status = 'info', title, description, onClose }) => {
  return (
    <Alert status={status} variant="left-accent" mb={4}>
      <AlertIcon />
      <Box flex="1">
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
      </Box>
      {onClose && <CloseButton position="absolute" right="8px" top="8px" onClick={onClose} />}
    </Alert>
  );
};

export default AlertBanner;
