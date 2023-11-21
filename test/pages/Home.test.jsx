import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { expect, it, afterEach, describe } from 'vitest';
import { Home } from '@pages';
import createMatchMedia from '../helpers/createMatchMedia';

describe('Home Page', () => {
  afterEach(() => {
    cleanup();
  });
  const h1FontSize = '144px';

  it('renders desktop', () => {
    render(<Home />);
    const cssProperties = getComputedStyle(screen.getByTestId('testHomeH1'));

    expect(screen.getByTestId('testHomeSection')).toBeDefined();
    expect(cssProperties.fontSize).toBe(h1FontSize);
  });

  it('renders mobile', () => {
    window.matchMedia = createMatchMedia(599);
    render(<Home />);
    const cssProperties = getComputedStyle(screen.getByTestId('testHomeH1'));

    expect(screen.getByTestId('testHomeSection')).toBeDefined();
    expect(cssProperties.fontSize).not.toBe(h1FontSize);
  });
});
