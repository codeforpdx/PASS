import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MessageFolder } from '@components/Messages';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockMessageFolder = () => <MessageFolder messageList={[]} />;

describe('Default screen', () => {
  it('renders 30px padding', () => {
    const component = render(<MockMessageFolder />);
    const adjustableBox = component.container.firstChild;
    const cssProperty = getComputedStyle(adjustableBox);

    expect(cssProperty.padding).toBe('30px');
  });

  it('renders refresh button margin to 10px', () => {
    const { getByRole } = render(<MockMessageFolder />);
    const button = getByRole('button', { name: 'Refresh' });
    const cssProperty = getComputedStyle(button);

    expect(cssProperty.margin).toBe('10px');
  });
});

describe('Mobile screen', () => {
  it("renders '30px 0px' padding", () => {
    window.matchMedia = createMatchMedia(599);
    const component = render(<MockMessageFolder />);
    const adjustableBox = component.container.firstChild;
    const cssProperty = getComputedStyle(adjustableBox);

    expect(cssProperty.padding).toBe('30px 0px');
  });

  it("renders refresh button margin to '10px 20px'", () => {
    window.matchMedia = createMatchMedia(599);
    const { getByRole } = render(<MockMessageFolder />);
    const button = getByRole('button', { name: 'Refresh' });
    const cssProperty = getComputedStyle(button);

    expect(cssProperty.margin).toBe('10px 20px');
  });
});
