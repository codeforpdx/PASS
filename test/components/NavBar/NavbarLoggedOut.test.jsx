import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavbarLoggedOut from '../../../src/components/NavBar/NavbarLoggedOut';

it('renders login button when user is logged out', () => {
  const { queryByLabelText, queryByRole } = render(
    <BrowserRouter>
      <NavbarLoggedOut />
    </BrowserRouter>
  );

  const logo = queryByLabelText('logo');
  const loginButton = queryByRole('button');

  expect(logo).not.toBeNull();
  expect(loginButton).not.toBeNull();
});
