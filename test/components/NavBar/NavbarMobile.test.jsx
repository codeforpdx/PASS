import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavbarMobile } from '@components/NavBar';
import createMatchMedia from '../../helpers/createMatchMedia';

const queryClient = new QueryClient();

const MockNavbarMobile = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <NavbarMobile openMenu />
    </BrowserRouter>
  </QueryClientProvider>
);

it('renders hamburger menu when on mobile', () => {
  const { queryByRole } = render(<MockNavbarMobile />);

  const logo = queryByRole('img', { name: /logo$/ });
  const navLinks = queryByRole('tablist');
  const hamburgerMenu = queryByRole('button', { name: /mobile/ });

  expect(logo).not.toBeNull();
  expect(navLinks).not.toBeNull();
  expect(hamburgerMenu).not.toBeNull();
});

it('removes tab links from header to NavMenu below 600px', async () => {
  window.matchMedia = createMatchMedia(599);
  const { queryByLabelText, queryByRole } = render(<MockNavbarMobile />);

  const logo = queryByRole('img', { name: /logo$/ });
  const navLinks = queryByLabelText('navigation tabs');
  const hamburgerMenu = queryByLabelText('mobile menu');

  expect(logo).not.toBeNull();
  expect(navLinks).toBeNull();
  expect(hamburgerMenu).not.toBeNull();
});
