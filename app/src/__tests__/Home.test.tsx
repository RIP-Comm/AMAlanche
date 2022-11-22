import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

test('renders title', async () => {
  render(<App />);
  await waitFor(() => {
    const title = screen.getByText('AMAlanche');
    expect(title).toBeInTheDocument();
  });
});
