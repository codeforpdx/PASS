import React from 'react';
import { render, cleanup, getByLabelText } from '@testing-library/react';
import { expect, it, afterEach } from 'vitest';
import { useSession } from '@hooks';
import NavBar from '../../../src/components/NavBar/NavBar';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

// trying to produce a session context
const { session } = useSession();
const SessionContext = session.info.isLoggedIn;

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
    <SessionContext.Provider value={{ session: { info: { loggedIn: true } } }}>
      <NavBar />
    </SessionContext.Provider>
  );
  // run a media query for screen size above mobile
  const iconMenu = getByLabelText('menu');

  expect(iconMenu).not.toBeNull();
});

it('renders NavbarMobile when user is logged in on smaller screen device', () => {
  render(
    <SessionContext.Provider value={{ session: { info: { loggedIn: true } } }}>
      <NavBar />
    </SessionContext.Provider>
  );
  // run a media query for screen size to be mobile
  const hamburgerMenu = getByLabelText('mobile menu');

  expect(hamburgerMenu).not.toBeNull();
});
