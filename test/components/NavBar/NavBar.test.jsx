import React from 'react';
import { render, cleanup, getByLabelText } from '@testing-library/react';
import { expect, it, afterEach } from 'vitest';
import { SessionContext } from '../../../src/contexts';
import NavBar from '../../../src/components/NavBar/NavBar';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

// able to change window size before testing for mobile/desktop options
const resizeWindow = (x, y) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent(new Event('resize'));
};

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
  resizeWindow(1200, 900);

  render(
    <SessionContext.Provider value={{ session: { info: { loggedIn: true } } }}>
      <NavBar />
    </SessionContext.Provider>
  );

  const iconMenu = getByLabelText('menu');

  expect(iconMenu).not.toBeNull();
});

it('renders NavbarMobile when user is logged in on smaller screen device', () => {
  resizeWindow(500, 900);

  render(
    <SessionContext.Provider value={{ session: { info: { loggedIn: true } } }}>
      <NavBar />
    </SessionContext.Provider>
  );

  const hamburgerMenu = getByLabelText('mobile menu');

  expect(hamburgerMenu).not.toBeNull();
});
