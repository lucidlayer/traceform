import React from 'react';
import { Box, Heading, Text, Stack, Input, Button, Icon } from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  return (
    <Box maxW="lg" mx="auto" p={8} bg="white" borderRadius="lg" boxShadow="md">
      <Stack gap={4} align="center">
        <Icon as={FiInfo} w={10} h={10} color="blue.400" />
        <Heading as="h1" size="xl">About Page</Heading>
        <Text fontSize="lg" color="gray.600">
          This is a sample application demonstrating various React concepts with a modern UI.
        </Text>
        <Input placeholder="Enter something..." maxW="sm" />
        <Button colorScheme="blue">Submit</Button>
      </Stack>
    </Box>
  );
};

export default AboutPage;
