import React from 'react';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { UploadDocumentModal } from '@components/Modals';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockUploadDocumentModal = () => <UploadDocumentModal showModal />;

it('renders cancel/upload group as row default', () => {
  const { getByRole } = render(<MockUploadDocumentModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders cancel/upload group as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByRole } = render(<MockUploadDocumentModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
