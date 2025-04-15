import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider, Box, Container } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AlertBanner from './components/AlertBanner';
import './App.css';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Box minH="100vh" bg="gray.50">
    <AlertBanner status="info" title="Welcome!" description="This is a demo notification. You can customize or control this banner as needed." />
    <Navbar />
    <Container maxW="container.xl" py={8}>
      {children}
    </Container>
  </Box>
);

const App: React.FC = () => {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout><HomePage /></Layout>,
      },
      {
        path: "/about",
        element: <Layout><AboutPage /></Layout>,
      },
      {
        path: "/contact",
        element: <Layout><ContactPage /></Layout>,
      },
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      },
    }
  );

  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
};

export default App;
