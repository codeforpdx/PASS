import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { expect, it, afterEach, describe } from 'vitest';
import { SessionContext } from '@contexts';
import createMatchMedia from '../../helpers/createMatchMedia';
import NavBar from '../../../src/components/NavBar/NavBar';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

describe('login tests', () => {
  it('renders NavbarLoggedOut when user is not logged in', () => {
    const { getByRole } = render(
      <SessionContext.Provider value={{ session: { info: { isLoggedIn: false } } }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    const loginButton = getByRole('button');

    expect(loginButton).not.toBeNull();
  });
});

describe('resize tests', () => {
  it('renders NavbarDesktop when user is logged in on larger screen device', () => {
    window.matchMedia = createMatchMedia(1200);

    const { getByTestId } = render(
      <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const iconMenu = getByTestId('navbar-menu');

    expect(iconMenu).not.toBeNull();
  });

  it('renders NavbarMobile when user is logged in on smaller screen device', () => {
    window.matchMedia = createMatchMedia(500);

    const { getByRole } = render(
      <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const hamburgerMenu = getByRole('button', { name: /mobile/ });

    expect(hamburgerMenu).not.toBeNull();
  });
});
