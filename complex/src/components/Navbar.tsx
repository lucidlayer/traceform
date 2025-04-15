import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  Container
} from '@chakra-ui/react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const isOpen = open;
  const bg = 'white';
  const borderColor = 'gray.200';

  const Links = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <Box bg={bg} px={4} borderBottomWidth={1} borderStyle={'solid'} borderColor={borderColor}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            aria-label={'Open Menu'}
            display={{ base: 'flex', md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </IconButton>
          <HStack gap={8} alignItems={'center'}>
            <Box fontWeight="bold">Your Logo</Box>
            <HStack as={'nav'} gap={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <Link
                  key={link.name}
                  as={RouterLink}
                  href={link.to}
                  px={2}
                  py={1}
                  borderRadius="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: 'gray.200',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </HStack>
          </HStack>
          <Button colorScheme="blue" size="sm">
            Get Started
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
