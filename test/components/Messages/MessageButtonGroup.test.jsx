import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MessageButtonGroup } from '@components/Messages';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockMessageButtonGroup = () => (
  <BrowserRouter>
    <MessageButtonGroup boxType="inbox" />
  </BrowserRouter>
);
it('renders button group as a row default', () => {
  const { getByRole } = render(<MockMessageButtonGroup />);
  const newMessageButton = getByRole('button', { name: 'New Message' });
  const buttonContainer = newMessageButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button group as a column below 480px', () => {
  window.matchMedia = createMatchMedia(479);
  const { getByRole } = render(<MockMessageButtonGroup />);
  const newMessageButton = getByRole('button', { name: 'New Message' });
  const buttonContainer = newMessageButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
