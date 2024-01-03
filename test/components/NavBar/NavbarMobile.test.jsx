import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import NavbarMobile from '../../../src/components/NavBar/NavbarMobile';
import createMatchMedia from '../../helpers/createMatchMedia';
import isAccessible from '../../utils/axe';

// TODO: Fix accessibility issues with this component
it.skip('should be accessible', () => {
  isAccessible(
    render(
      <BrowserRouter>
        <NavbarMobile />
      </BrowserRouter>
    )
  );
});

it('renders hamburger menu when on mobile', () => {
  const { queryByRole } = render(
    <BrowserRouter>
      <NavbarMobile />
    </BrowserRouter>
  );

  const logo = queryByRole('img', { name: /logo$/ });
  const navLinks = queryByRole('tablist');
  const hamburgerMenu = queryByRole('button', { name: /mobile/ });

  expect(logo).not.toBeNull();
  expect(navLinks).not.toBeNull();
  expect(hamburgerMenu).not.toBeNull();
});

it('removes tab links from header to NavMenu below 600px', async () => {
  window.matchMedia = createMatchMedia(599);
  const { queryByLabelText, queryByRole } = render(
    <BrowserRouter>
      <NavbarMobile />
    </BrowserRouter>
  );

  const logo = queryByRole('img', { name: /logo$/ });
  const navLinks = queryByLabelText('navigation tabs');
  const hamburgerMenu = queryByLabelText('mobile menu');

  expect(logo).not.toBeNull();
  expect(navLinks).toBeNull();
  expect(hamburgerMenu).not.toBeNull();
});
