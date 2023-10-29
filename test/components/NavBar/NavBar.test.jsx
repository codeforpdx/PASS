import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import mediaQuery from 'css-mediaquery';
import { render, cleanup } from '@testing-library/react';
import { expect, it, afterEach, describe } from 'vitest';
import { SessionContext } from '@contexts';
import NavBar from '../../../src/components/NavBar/NavBar';

const createMatchMedia = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => {},
  removeListener: () => {}
});

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

    const { getByLabelText } = render(
      <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const iconMenu = getByLabelText('menu');

    expect(iconMenu).not.toBeNull();
  });

  it('renders NavbarMobile when user is logged in on smaller screen device', () => {
    window.matchMedia = createMatchMedia(500);

    const { getByLabelText } = render(
      <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const hamburgerMenu = getByLabelText('mobile menu');

    expect(hamburgerMenu).not.toBeNull();
  });
});
