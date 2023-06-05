import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { expect, it, vi, afterEach, beforeEach, describe } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { useSession, SessionProvider } from '@inrupt/solid-ui-react';
import { BrowserRouter as Router } from 'react-router-dom';
import flushPromises from './testHelpers';

import theme from '../src/theme';

import App from '../src/App';

const AppWithContexts = () => (
  <Router>
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </SessionProvider>
  </Router>
);

vi.mock('@inrupt/solid-client');

vi.mock('@inrupt/solid-ui-react', async () => {
  const lib = await vi.importActual('@inrupt/solid-ui-react');
  return {
    ...lib,
    useSession: vi.fn(() => ({
      session: {
        fetch: vi.fn(),
        info: {
          isLoggedIn: false,
          webId: 'https://example.com/'
        }
      }
    }))
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([{ type: '' }]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders landing page when not logged in', () => {
    const { getByLabelText } = render(<AppWithContexts />);
    const landingPage = getByLabelText('Landing Page');
    expect(landingPage).not.toBe(null || undefined);
  });

  it('renders home page when logged in', async () => {
    useSession.mockReturnValue({
      session: {
        info: {
          isLoggedIn: true,
          webId: 'https://example.com/'
        },
        fetch: vi.fn()
      }
    });
    const { getByLabelText } = render(<AppWithContexts />);
    await flushPromises();
    const homePage = getByLabelText('Home Page');
    expect(homePage).not.toBe(null || undefined);
  });

  it('calls session.login after page refresh', () => {
    const login = vi.fn();
    useSession.mockReturnValue({
      session: {
        login,
        info: {
          isLoggedIn: true,
          webId: 'https://example.com/'
        },
        fetch: vi.fn()
      }
    });

    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([{ type: 'reload' }]);
    render(<AppWithContexts />);
    flushPromises();
    expect(login).toBeCalled();
  });
});
