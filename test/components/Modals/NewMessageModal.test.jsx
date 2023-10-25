import React from 'react';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { NewMessageModal } from '@components/Modals';
import createMatchMedia from '../../test-helper/createMatchMedia';

const MockNewMessageModal = () => <NewMessageModal showModal />;

it('renders button group flex-direction as row default', () => {
  const { getByText } = render(<MockNewMessageModal />);
  const cancelButton = getByText('Cancel');
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button group flex-direction as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByText } = render(<MockNewMessageModal />);
  const cancelButton = getByText('Cancel');
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
