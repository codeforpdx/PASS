import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { NavbarLoggedOut } from '@components/NavBar';
import theme from '../../../src/theme';
import createMatchMedia from '../../helpers/createMatchMedia';

it('renders login button when user is logged out', () => {
  const { queryByRole } = render(
    <BrowserRouter>
      <NavbarLoggedOut />
    </BrowserRouter>
  );

  const logo = queryByRole('img', { name: /logo$/ });
  const loginButton = queryByRole('button');

  expect(logo).not.toBeNull();
  expect(loginButton).not.toBeNull();
});

it('renders sign-in button when user is logged out below 600px', async () => {
  window.matchMedia = createMatchMedia(599);
  const { queryByRole } = render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavbarLoggedOut />
      </BrowserRouter>
    </ThemeProvider>
  );

  const signInButton = queryByRole('button', { name: 'Sign In' });
  const loginButton = queryByRole('button', { name: 'Login' });

  expect(signInButton).not.toBeNull();
  expect(loginButton).toBeNull();
});
