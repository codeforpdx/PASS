import React from 'react';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import UploadButtonGroup from '../../../src/components/Modals/UploadButtonGroup';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockUploadButtonGroup = () => <UploadButtonGroup />;

it('renders only one button above 768px', () => {
  const { getAllByRole } = render(<MockUploadButtonGroup />);
  const buttons = getAllByRole('button');

  expect(buttons.length).toBe(1);
});

it("renders button group flex-direction as row before 'sm', below 768px", () => {
  window.matchMedia = createMatchMedia(767);
  const { getByRole } = render(<MockUploadButtonGroup />);
  const chooseFileButton = getByRole('button', { name: 'Choose file' });
  const buttonContainer = chooseFileButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button group flex-direction as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByRole } = render(<MockUploadButtonGroup />);
  const chooseFileButton = getByRole('button', { name: 'Choose file' });
  const buttonContainer = chooseFileButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
