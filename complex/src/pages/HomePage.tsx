import React from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { FiStar, FiTrendingUp, FiZap } from 'react-icons/fi';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack gap={4} bg="white" p={6} borderRadius="lg" boxShadow="md">
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        borderRadius={'full'}
        bg={'blue.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

const HomePage: React.FC = () => {
  return (
    <Box>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          gap={8}
          py={20}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            Welcome to <br />
            <Text as={'span'} color={'blue.400'}>
              Our Amazing App
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Experience the next generation of web applications. Built with the latest
            technologies to provide you with the best possible user experience.
          </Text>
          <Stack
            direction={'column'}
            gap={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Button
              colorScheme={'blue'}
              bg={'blue.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Get Started
            </Button>
            <Button variant={'ghost'} colorScheme={'blue'} size={'sm'}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>

      <Box p={4}>
        <SimpleGrid columns={3} gap={10}>
          <Feature
            icon={<FiStar size={40} />} // Use react-icons directly
            title={'Premium Features'}
            text={'Get access to exclusive features that will boost your productivity.'}
          />
          <Feature
            icon={<FiTrendingUp size={40} />} // Use react-icons directly
            title={'Scale Quickly'}
            text={'Our platform grows with your needs, ensuring smooth scaling.'}
          />
          <Feature
            icon={<FiZap size={40} />} // Use react-icons directly
            text={'Experience lightning-fast performance with our optimized platform.'}
            title={'Instant Performance'}
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default HomePage;
