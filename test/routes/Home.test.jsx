import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { expect, it, afterEach, describe } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';

import Home from '../../src/routes/Home';
import theme from '../../src/theme';

const HomeWithContexts = () => (
  <ThemeProvider theme={theme}>
    <Home />
  </ThemeProvider>
);

describe('Home Page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders', () => {
    const { container } = render(<HomeWithContexts />);
    expect(container).toMatchSnapshot();
  });
});
