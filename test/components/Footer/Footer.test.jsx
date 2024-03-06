import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup, screen } from '@testing-library/react';
import { expect, it, afterEach, describe, vi } from 'vitest';
import { SessionContext } from '@contexts';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../src/theme';
import Footer from '../../../src/components/Footer/Footer';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

vi.mock('@mui/material/useMediaQuery', async (importOriginal) => ({
  ...importOriginal,
  default: () => true
}));

describe('Footer', () => {
  it('renders `h2` elements for headings', () => {
    render(
      <SessionContext.Provider value={{ session: { info: { isLoggedIn: false } } }}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Footer />
          </BrowserRouter>
        </ThemeProvider>
      </SessionContext.Provider>
    );

    const headings = screen.getAllByRole('heading', { level: 2 });

    expect(headings.length).toBe(2);
  });

  it('renders column when screen is small', () => {
    const { getAllByRole } = render(
      <SessionContext.Provider value={{ session: { info: { isLoggedIn: false } } }}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Footer />
          </BrowserRouter>
        </ThemeProvider>
      </SessionContext.Provider>
    );

    expect(getAllByRole('separator').length).not.toBe(0);
  });
});
