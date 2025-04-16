import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Textarea,
  Button,
  Stack
} from '@chakra-ui/react';

const ContactPage: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We have received your message.');
    setMessage('');
  };

  return (
    <Box maxW="lg" mx="auto" p={8} bg="white" rounded="lg" shadow="md">
      <Stack spacing={6}>
        <Heading as="h1" size="xl" textAlign="center">Contact Us</Heading>
        <Text color="gray.600" textAlign="center">
          Have questions or feedback? Send us a message below.
        </Text>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="message" style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>
              Your Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={5}
            />
            <small style={{ color: '#718096' }}>We'll get back to you as soon as possible.</small>
          </div>
          <Button mt={4} colorScheme="blue" type="submit" w="full">
            Send Message
          </Button>
        </form>
      </Stack>
    </Box>
  );
};

export default ContactPage;
