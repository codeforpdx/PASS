import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { expect, it, afterEach, describe } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';

import LandingPage from '../../src/routes/LandingPage';
import theme from '../../src/theme';

const LandingPageWithContexts = () => (
  <ThemeProvider theme={theme}>
    <LandingPage />
  </ThemeProvider>
);

describe('Landing Page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders', () => {
    const { container } = render(<LandingPageWithContexts />);
    expect(container).toMatchSnapshot();
  });
});
