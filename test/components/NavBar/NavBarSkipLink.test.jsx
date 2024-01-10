import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it } from 'vitest';
import { NavBarSkipLink } from '@components/NavBar';

describe('NavBarSkipLink', () => {
  it('renders', () => {
    render(
      <BrowserRouter>
        <NavBarSkipLink />
      </BrowserRouter>
    );
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).not.toBeNull();
  });

  it('animates into view', async () => {
    render(
      <BrowserRouter>
        <NavBarSkipLink />
      </BrowserRouter>
    );

    const skipLink = screen.getByText('Skip to main content');

    // get styles
    const initialOpacity = window.getComputedStyle(skipLink).opacity;
    const initialTransform = window.getComputedStyle(skipLink).transform;

    // starts out of view
    expect(initialOpacity).toBe('0');
    expect(initialTransform).toBe('translateY(-100%)');

    // tab event
    await userEvent.tab();

    // wait for animation
    await fireEvent.animationEnd(skipLink);

    // get styles
    const afterTabKeyPressOpacity = window.getComputedStyle(skipLink).opacity;
    const afterTabKeyPressTransform = window.getComputedStyle(skipLink).transform;

    // in view
    expect(afterTabKeyPressOpacity).toBe('1');
    expect(afterTabKeyPressTransform).toBe('translateY(0%)');
  });

  it('animates out of view', async () => {
    render(
      <BrowserRouter>
        <NavBarSkipLink />
      </BrowserRouter>
    );
    const skipLink = screen.getByText('Skip to main content');

    // trigger link into view
    await userEvent.tab();
    const initialOpacity = window.getComputedStyle(skipLink).opacity;
    const initialTransform = window.getComputedStyle(skipLink).transform;

    // in view
    expect(initialOpacity).toBe('1');
    expect(initialTransform).toBe('translateY(0%)');

    // tab event
    await userEvent.tab();

    // wait for animation to end
    await fireEvent.animationEnd(skipLink);

    // get styles
    const afterTabKeyPressOpacity = window.getComputedStyle(skipLink).opacity;
    const skipLinkAfterClick = window.getComputedStyle(skipLink).transform;

    // out of view
    expect(afterTabKeyPressOpacity).toBe('0');
    expect(skipLinkAfterClick).toBe('translateY(-100%)');
  });
});
