import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { expect, it, afterEach, describe } from 'vitest';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import createMatchMedia from '../../helpers/createMatchMedia';
import NavBar from '../../../src/components/NavBar/NavBar';
import isAccessible from '../../utils/axe';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

describe('Accessibility', () => {
  const renderExample = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={{ session: { info: { isLoggedIn: false } } }}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    );

  // These are set to async/await so that they don't conflict with each other.
  // `axe` requires synchronous execution, so if multiple are running at once,
  // it can give false positives.
  it('should be accessible', async () => {
    await isAccessible(renderExample());
  });

  it('should be accessible on mobile', async () => {
    window.matchMedia = createMatchMedia(1200);
    await isAccessible(renderExample());
  });
});

describe('login tests', () => {
  it('renders NavbarLoggedOut when user is not logged in', () => {
    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={{ session: { info: { isLoggedIn: false } } }}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    );
    const loginButton = getByRole('button');

    expect(loginButton).not.toBeNull();
  });
});

describe('resize tests', () => {
  it('renders NavbarDesktop when user is logged in on larger screen device', () => {
    window.matchMedia = createMatchMedia(1200);

    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    );

    const iconMenu = getByRole('group');

    expect(iconMenu).not.toBeNull();
  });

  it('renders NavbarMobile when user is logged in on smaller screen device', () => {
    window.matchMedia = createMatchMedia(500);

    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    );

    const hamburgerMenu = getByRole('button', { name: /mobile/ });

    expect(hamburgerMenu).not.toBeNull();
  });
});
