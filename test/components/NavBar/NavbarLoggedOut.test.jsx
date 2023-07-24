import React from 'react';
import {
  render,
  cleanup,
  waitForElementToBeRemoved,
  queryByLabelText
} from '@testing-library/react';
import { expect, it, vi, afterEach } from 'vitest';
import NavbarLoggedOut from '../../../src/components/NavBar/NavbarLoggedOut';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

// goes in NavbarLoggedOut test file
it('renders login button when user is logged out', () => {
  render(<NavbarLoggedOut />);

  const logo = queryByLabelText('logo');
  const loginButton = queryByLabelText('Login Button');

  expect(logo).not.toBeNull();
  expect(loginButton).not.toBeNull();
});
