import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';
import { makeStore } from './redux/store';
import Router from './router/root';

function App() {
  const store = makeStore();

  return (
    <PersistGate persistor={store}>
      <ChakraProvider>
        <BrowserRouter>
          <HelmetProvider>
            <Router />
          </HelmetProvider>
        </BrowserRouter>
      </ChakraProvider>
    </PersistGate>
  );
}

export default App;
