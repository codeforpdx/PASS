import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { AddContactModal } from '@components/Modals';
import createMatchMedia from '../../test-helper/createMatchMedia';

const MockAddContactModal = () => <AddContactModal showAddContactModal />;

it('renders button container flex-direction row default', () => {
  const { getByText } = render(<MockAddContactModal />);
  const cancelButton = getByText('Cancel');
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button container flex-direction column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByText } = render(<MockAddContactModal />);
  const cancelButton = getByText('Cancel');
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
