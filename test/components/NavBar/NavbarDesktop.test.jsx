import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import NavbarDesktop from '../../../src/components/NavBar/NavbarDesktop';

it('renders icon menu when on screen larger than mobile', () => {
  const { queryByRole } = render(
    <BrowserRouter>
      <NavbarDesktop />
    </BrowserRouter>
  );

  const logo = queryByRole('img', { name: /logo$/ });
  const navLinks = queryByRole('tablist', { name: 'navigation tabs' });
  const navbarMenu = queryByRole('group');

  expect(logo).not.toBeNull();
  expect(navLinks).not.toBeNull();
  expect(navbarMenu).not.toBeNull();
});
