import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/react';
import Router from './router/root';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <HelmetProvider>
          <Router />
        </HelmetProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
