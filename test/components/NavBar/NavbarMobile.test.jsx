import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import NavbarMobile from '../../../src/components/NavBar/NavbarMobile';

it('renders hamburger menu when on mobile', () => {
  const { queryByLabelText, queryByRole } = render(
    <BrowserRouter>
      <NavbarMobile />
    </BrowserRouter>
  );

  const logo = queryByRole('img', { name: /logo$/ });
  const navLinks = queryByLabelText('navigation tabs');
  const hamburgerMenu = queryByLabelText('mobile menu');

  expect(logo).not.toBeNull();
  expect(navLinks).not.toBeNull();
  expect(hamburgerMenu).not.toBeNull();
});
