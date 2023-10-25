import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { NavbarLoggedOut } from '@components/NavBar';

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
