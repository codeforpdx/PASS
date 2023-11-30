import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { expect, describe, it, afterEach } from 'vitest';
import { Home } from '@pages';
import createMatchMedia from '../helpers/createMatchMedia';

describe('Home Page', () => {
  afterEach(cleanup);

  it('renders with correct order of logoSection on mobile', () => {
    window.matchMedia = createMatchMedia(599);
    render(<Home />);
    const h1 = screen.getByTestId('testStack');
    const children = Array.from(h1.children);

    expect(children.length).toBe(3);
    expect(children[0].tagName.toLowerCase()).toBe('span');
    expect(children[1].tagName.toLowerCase()).toBe('img');
    expect(children[2].tagName.toLowerCase()).toBe('span');
  });

  it('rrenders with correct order of logoSection on desktop', () => {
    window.matchMedia = createMatchMedia(1200);
    render(<Home />);
    const h1 = screen.getByTestId('testStack');
    const children = Array.from(h1.children);

    expect(children.length).toBe(2);
    expect(children[0].tagName.toLowerCase()).toBe('span');
    expect(children[1].tagName.toLowerCase()).toBe('span');
  });
});
