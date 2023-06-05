import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { expect, it, afterEach, describe, vi } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { SessionProvider } from '@inrupt/solid-ui-react';
import { BrowserRouter as Router } from 'react-router-dom';

import Home from '../../src/routes/Home';
import theme from '../../src/theme';
import { SignedInUserContextProvider } from '../../src/contexts';
import flushPromises from '../testHelpers';

const HomeWithContexts = () => (
  <Router>
    <SessionProvider>
      <SignedInUserContextProvider>
        <ThemeProvider theme={theme}>
          <Home />
        </ThemeProvider>
      </SignedInUserContextProvider>
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

describe('Home Page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders', async () => {
    const { getByLabelText } = render(<HomeWithContexts />);
    await flushPromises();
    expect(getByLabelText('Home Page')).not.toBe(null || undefined);
  });
});
