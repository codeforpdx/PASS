import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Main from '../../src/layouts/Main';

describe('Main Component', () => {
  it('renders', () => {
    render(<Main />);
  });

  it('takes children', () => {
    const { getByText } = render(<Main>child test</Main>);
    const child = getByText('child test');
    expect(child).not.toBeNull();
  });

  it('renders with id', () => {
    const { container } = render(<Main />);
    const mainElement = container.querySelector('#main-content');
    expect(mainElement).not.toBeNull();
  });
});
