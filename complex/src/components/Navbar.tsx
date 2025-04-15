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


// Highlight: "Navbar" and right click "TraceformL Find component in UI"
const Navbar: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const isOpen = open;
  const bg = 'red.500';
  const borderColor = 'purple.300';

  const Links = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <Box bg={bg} px={4} borderBottomWidth={8} borderStyle={'dashed'} borderColor={borderColor}>
      <Container maxW="container.xl">
        <Flex h={32} alignItems={'flex-start'} justifyContent={'center'}>
          <IconButton
            size={'sm'}
            aria-label={'Open Menu'}
            display={{ base: 'flex', md: 'flex' }}
            onClick={isOpen ? onClose : onOpen}
            position="absolute"
            right="10px"
            top="5px"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </IconButton>
          <HStack gap={2} alignItems={'center'} flexDirection={{ base: 'column', md: 'column' }}>
            <Box fontWeight="bold" fontSize="3xl" color="yellow.300" transform="rotate(5deg)">Y0ur L0g0</Box>
            <HStack as={'nav'} gap={1} display={{ base: 'flex', md: 'flex' }} flexWrap="wrap" justifyContent="center">
              {Links.map((link) => (
                <Link
                  key={link.name}
                  as={RouterLink}
                  href={link.to}
                  px={6}
                  py={3}
                  borderRadius="full"
                  backgroundColor="green.200"
                  color="purple.800"
                  fontWeight="extrabold"
                  fontSize="xs"
                  textTransform="uppercase"
                  _hover={{
                    textDecoration: 'underline',
                    bg: 'pink.400',
                  }}
                >
                  {link.name.split('').reverse().join('')}
                </Link>
              ))}
            </HStack>
          </HStack>
          <Button 
            position="absolute" 
            left="10px"
            bottom="5px"
            colorScheme="orange" 
            size="lg"
            transform="rotate(-10deg)"
          >
            GET STARTED!!!
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
