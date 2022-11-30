import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { createRouterWrapper } from './Home.spec';

import Signup from '../pages/signup';

const mockForm = {
  username: 'tester',
  email: 'test@mr.rip',
  password: 'password',
  invalidUsername: 'test',
  invalidEmail: 'testmr.rip',
  invalidPassword: 'pass'
};

describe('Signup', () => {
  test('correct form values', async () => {
    render(createRouterWrapper('/signup', <Signup />));
    await waitFor(async () => {
      const UsernameInput = screen.getByLabelText('Username');
      const EmailInput = screen.getByLabelText('Email');
      const PasswordInput = screen.getByLabelText('Password');
      const SubmitButton = screen.getByRole('button', { name: 'Signup' });

      await act(async () => {
        fireEvent.change(UsernameInput, { target: { value: mockForm.username } });
        fireEvent.change(EmailInput, { target: { value: mockForm.email } });
        fireEvent.change(PasswordInput, { target: { value: mockForm.password } });
        fireEvent.click(SubmitButton);
      });
    });
  });

  test('empty form', async () => {
    render(createRouterWrapper('/signup', <Signup />));
    await waitFor(async () => {
      const SubmitButton = screen.getByRole('button', { name: 'Signup' });

      await act(async () => {
        fireEvent.click(SubmitButton);
      });

      await waitFor(async () => {
        expect(screen.getByText('Username is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });
  });

  test('wrong form values', async () => {
    render(createRouterWrapper('/signup', <Signup />));
    await waitFor(async () => {
      const UsernameInput = screen.getByLabelText('Username');
      const EmailInput = screen.getByLabelText('Email');
      const PasswordInput = screen.getByLabelText('Password');
      const SubmitButton = screen.getByRole('button', { name: 'Signup' });

      await act(async () => {
        fireEvent.change(UsernameInput, { target: { value: mockForm.invalidUsername } });
        fireEvent.change(EmailInput, { target: { value: mockForm.invalidEmail } });
        fireEvent.change(PasswordInput, { target: { value: mockForm.invalidPassword } });
        fireEvent.click(SubmitButton);
      });

      await waitFor(async () => {
        expect(screen.getByText('Username must be at least 6 characters')).toBeInTheDocument();
        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });
  });
});
