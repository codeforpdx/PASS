import React from 'react';
import { ConfirmationModal } from '@components/Modals';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import createMatchMedia from '../../test-helper/createMatchMedia';

const MockConfirmationModal = () => <ConfirmationModal showConfirmationModal title="Action" />;
const MockConfirmationModalLogout = () => (
  <ConfirmationModal showConfirmationModal isLogout title="Logout" />
);

describe('Default screen', () => {
  it('renders button container flex-direction as row default', () => {
    const { getByText } = render(<MockConfirmationModal />);
    const button = getByText('Cancel');
    const buttonContainer = button.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('row');
  });

  it('renders logout button container flex-direction as row default', () => {
    const { getByText } = render(<MockConfirmationModalLogout />);
    const button = getByText('Cancel');
    const buttonContainer = button.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('row');
  });
});

describe('Mobile screen', () => {
  it('renders button container flex-direction as column mobile', () => {
    window.matchMedia = createMatchMedia(599);
    const { getByText } = render(<MockConfirmationModal />);
    const button = getByText('Cancel');
    const buttonContainer = button.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('column');
  });

  it('renders logout button container flex-direction as column mobile', () => {
    const { getByText } = render(<MockConfirmationModalLogout />);
    const button = getByText('Cancel');
    const buttonContainer = button.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('column');
  });
});
