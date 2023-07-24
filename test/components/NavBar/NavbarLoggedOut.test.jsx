import React from 'react';
import { render, queryByLabelText } from '@testing-library/react';
import { expect, it } from 'vitest';
import NavbarLoggedOut from '../../../src/components/NavBar/NavbarLoggedOut';

it('renders login button when user is logged out', () => {
  render(<NavbarLoggedOut />);

  const logo = queryByLabelText('logo');
  const loginButton = queryByLabelText('Login Button');

  expect(logo).not.toBeNull();
  expect(loginButton).not.toBeNull();
});
