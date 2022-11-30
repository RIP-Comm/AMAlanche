import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { createRouterWrapper } from './Home.spec';

import Login from '../pages/login';

const mockForm = {
  email: 'test@mr.rip',
  password: 'password',
  invalidEmail: 'testmr.rip',
  invalidPassword: 'pass'
};

describe('Login', () => {
  test('correct form values', async () => {
    render(createRouterWrapper('/login', <Login />));
    await waitFor(async () => {
      const EmailInput = screen.getByLabelText('Email');
      const PasswordInput = screen.getByLabelText('Password');
      const SubmitButton = screen.getByRole('button', { name: 'Login' });

      await act(async () => {
        fireEvent.change(EmailInput, { target: { value: mockForm.email } });
        fireEvent.change(PasswordInput, { target: { value: mockForm.password } });
        fireEvent.click(SubmitButton);
      });
    });
  });

  test('empty form', async () => {
    render(createRouterWrapper('/login', <Login />));
    await waitFor(async () => {
      const SubmitButton = screen.getByRole('button', { name: 'Login' });

      await act(async () => {
        fireEvent.click(SubmitButton);
      });

      await waitFor(async () => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });
  });

  test('wrong form values', async () => {
    render(createRouterWrapper('/login', <Login />));
    await waitFor(async () => {
      const EmailInput = screen.getByLabelText('Email');
      const PasswordInput = screen.getByLabelText('Password');
      const SubmitButton = screen.getByRole('button', { name: 'Login' });

      await act(async () => {
        fireEvent.change(EmailInput, { target: { value: mockForm.invalidEmail } });
        fireEvent.change(PasswordInput, { target: { value: mockForm.invalidPassword } });
        fireEvent.click(SubmitButton);
      });

      await waitFor(async () => {
        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
        expect(screen.getByText('Password is invalid')).toBeInTheDocument();
      });
    });
  });
});
