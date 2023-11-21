import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { expect, it, afterEach, describe } from 'vitest';
import { Home } from '@pages';
import createMatchMedia from '../helpers/createMatchMedia';

describe('Home Page', () => {
  afterEach(cleanup);
  // if tests are failing check this value vs value in Home.jsx
  const h1FontSize = '144px';

  it('renders desktop', () => {
    render(<Home />);
    const h1 = screen.getByTestId('testHomeH1');
    const h1Styles = getComputedStyle(h1);

    expect(screen.getByTestId('testHomeSection')).toBeDefined();
    expect(h1Styles.fontSize).toBe(h1FontSize);
  });

  it('renders mobile', () => {
    window.matchMedia = createMatchMedia(599);
    render(<Home />);
    const h1 = screen.getByTestId('testHomeH1');
    const h1Styles = getComputedStyle(h1);

    expect(screen.getByTestId('testHomeSection')).toBeDefined();
    expect(h1Styles.fontSize).not.toBe(h1FontSize);
  });
});
