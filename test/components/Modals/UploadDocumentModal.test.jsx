import React from 'react';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { UploadDocumentModal } from '@components/Modals';
import createMatchMedia from '../../test-helper/createMatchMedia';

const MockUploadDocumentModal = () => <UploadDocumentModal showModal />;

it('renders cancel/upload group as row default', () => {
  const { getByText } = render(<MockUploadDocumentModal />);
  const cancelButton = getByText('Cancel');
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders cancel/upload group as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByText } = render(<MockUploadDocumentModal />);
  const cancelButton = getByText('Cancel');
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
