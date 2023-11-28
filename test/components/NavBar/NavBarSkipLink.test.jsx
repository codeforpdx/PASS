import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it } from 'vitest';
import { NavBarSkipLink } from '@components/NavBar';

describe('NavBarSkipLink', () => {
  it('renders', () => {
    render(<NavBarSkipLink />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).not.toBeNull();
  });

  it('moves the button in and out of view', async () => {
    render(<NavBarSkipLink />);
    const skipLink = screen.getByText('Skip to main content');

    const initialOpacity = window.getComputedStyle(skipLink).opacity;
    const initialTransform = window.getComputedStyle(skipLink).transform;

    expect(initialOpacity).toBe('0');
    expect(initialTransform).toBe('translateY(-100%)');

    await userEvent.tab();

    await waitFor(() => {
      const afterTabKeyPressOpacity = window.getComputedStyle(skipLink).opacity;
      const afterTabKeyPressTransform = window.getComputedStyle(skipLink).transform;

      expect(afterTabKeyPressOpacity).toBe('1');
      expect(afterTabKeyPressTransform).not.toBe('translateY(0)');
    });

    await userEvent.click(skipLink);

    await waitFor(() => {
      const skipLinkAfterClick = window.getComputedStyle(skipLink).transform;
      expect(skipLinkAfterClick).toBe('translateY(-100%)');
    });
  });
});
