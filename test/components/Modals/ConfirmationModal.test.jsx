import React from 'react';
import { ConfirmationModal } from '@components/Modals';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import createMatchMedia from '../../helpers/createMatchMedia';
import '@testing-library/jest-dom/extend-expect';

const MockConfirmationModalBasic = () => (
  <ConfirmationModal showModal title="Action" cancelButtonText="Cancel" />
);
const MockConfirmationModalLogout = () => (
  <ConfirmationModal showModal isLogout title="Logout" cancelButtonText="Log Out" />
);

describe('Default screen', () => {
  it('renders button container flex-direction as row default', () => {
    const { getByRole } = render(<MockConfirmationModalBasic />);
    const cancelButton = getByRole('button', { name: 'Cancel' });
    const buttonContainer = cancelButton.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('row');
  });

  it('renders logout button container flex-direction as row default', () => {
    const { getByRole } = render(<MockConfirmationModalLogout />);
    const confirmButton = getByRole('button', { name: 'Log Out' });
    const buttonContainer = confirmButton.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('row');
  });
});

describe('Mobile screen', () => {
  it('renders button container flex-direction as column mobile', () => {
    window.matchMedia = createMatchMedia(599);
    const { getByRole } = render(<MockConfirmationModalBasic />);
    const cancelButton = getByRole('button', { name: 'Cancel' });
    const buttonContainer = cancelButton.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('column');
  });

  it('renders logout button container flex-direction as column mobile', () => {
    const { getByRole } = render(<MockConfirmationModalLogout />);
    const confirmButton = getByRole('button', { name: 'Log Out' });
    const buttonContainer = confirmButton.parentElement;
    const cssProperty = getComputedStyle(buttonContainer);

    expect(cssProperty.flexDirection).toBe('column');
  });
});

describe('Renders correct text for: ', () => {
  it('title', () => {
    const customTitle = 'CUSTOM TITLE';
    const { getByRole } = render(<ConfirmationModal showModal title={customTitle} />);
    const title = getByRole('heading', { name: customTitle });
    expect(title).toBeInTheDocument();
  });
  it('text', () => {
    const customText = 'Custom Text';
    const { getByText } = render(<ConfirmationModal showModal text={customText} />);
    const text = getByText(customText);
    expect(text).toBeInTheDocument();
  });
  it('confirm button', () => {
    const customConfirmButtonText = 'Custom Confirm Button Text';
    const { getByRole } = render(
      <ConfirmationModal showModal confirmButtonText={customConfirmButtonText} />
    );
    const confirmButton = getByRole('button', { name: customConfirmButtonText });
    expect(confirmButton).toBeInTheDocument();
  });
  it('cancel button', () => {
    const customCancelButtonText = 'Custom Cancel Button Text';
    const { getByRole } = render(
      <ConfirmationModal showModal cancelButtonText={customCancelButtonText} />
    );
    const cancelButton = getByRole('button', { name: customCancelButtonText });
    expect(cancelButton).toBeInTheDocument();
  });
});

it('triggers custom confirm action on click', () => {
  const customConfirmButtonText = 'Custom Confirm Button Text';
  const customConfirmButtonAction = vi.fn();
  const { getByRole } = render(
    <ConfirmationModal
      showModal
      confirmButtonText={customConfirmButtonText}
      onConfirm={customConfirmButtonAction}
    />
  );
  const confirmButton = getByRole('button', { name: customConfirmButtonText });
  confirmButton.click();
  expect(customConfirmButtonAction).toHaveBeenCalled();
});

it('triggers custom cancel action on click', () => {
  const customCancelButtonText = 'Custom Cancel Button Text';
  const customCancelButtonAction = vi.fn();
  const setShowModal = vi.fn();
  const { getByRole } = render(
    <ConfirmationModal
      showModal
      setShowModal={setShowModal}
      cancelButtonText={customCancelButtonText}
      onCancel={customCancelButtonAction}
    />
  );
  const cancelButton = getByRole('button', { name: customCancelButtonText });
  cancelButton.click();
  expect(setShowModal).toHaveBeenCalledWith(false);
  expect(customCancelButtonAction).toHaveBeenCalled();
});
