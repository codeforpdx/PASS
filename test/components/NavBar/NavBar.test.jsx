import React from 'react';
import { render, cleanup, getByLabelText } from '@testing-library/react';
import { expect, it, vi, afterEach } from 'vitest';
import NavBar from '../../../src/components/NavBar/NavBar';
import { useSession } from '@hooks';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

const { session } = useSession();

it('renders NavbarLoggedOut when user is not logged in', () => {
  render(
    <SessionContext.Provider value={{ session: { info: { loggedIn: false } } }}>
      <NavBar />
    </SessionContext.Provider>
  );
  const loginButton = getByLabelText('Login Button');

  expect(loginButton).not.toBeNull();
});

it('renders NavbarDesktop when user is logged in on larger screen device', () => {
  render(
    <SessionContext.Provider value={{ session: { info: { loggedIn: false } } }}>
      <NavBar />
    </SessionContext.Provider>
  );
  // run a media query for screen size above mobile
  const iconMenu = getByLabelText('menu');

  expect(iconMenu).not.toBeNull();
});

it('renders NavbarMobile when user is logged in on smaller screen device', () => {
  render(
    <SessionContext.Provider value={{ session: { info: { loggedIn: false } } }}>
      <NavBar />
    </SessionContext.Provider>
  );
  // run a media query for screen size to be mobile
  const hamburgerMenu = getByLabelText('mobile menu');

  expect(hamburgerMenu).not.toBeNull();
});
