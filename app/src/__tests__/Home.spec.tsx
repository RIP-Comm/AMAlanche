import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryRouter,
  RouteObject
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';
import { makeStore } from '../redux/store';

import App from '../App';

describe('Home', () => {
  test('renders elements', async () => {
    render(<App />);
    await waitFor(() => {
      const title = screen.getByText('Amalanche');
      const loginLink = screen.getByText('Login');
      const signupLink = screen.getByText('Signup');
      expect(title).toBeInTheDocument();
      expect(loginLink).toBeInTheDocument();
      expect(signupLink).toBeInTheDocument();
    });
  });
});

export function createRouterWrapper(
  route: string,
  page: RouteObject['element']
) {
  const routes = [
    {
      path: route,
      element: page
    }
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ['/', route],
    initialIndex: 1
  });
  const store = makeStore();

  return (
    <PersistGate persistor={store}>
      <ChakraProvider>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </ChakraProvider>
    </PersistGate>
  );
}
