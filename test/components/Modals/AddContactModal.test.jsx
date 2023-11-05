import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { AddContactModal } from '@components/Modals';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockAddContactModal = () => <AddContactModal showAddContactModal />;

it('renders button container flex-direction row default', () => {
  const { getByRole } = render(<MockAddContactModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button container flex-direction column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByRole } = render(<MockAddContactModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
