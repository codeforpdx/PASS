import React from 'react';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { UploadDocumentModal } from '@components/Modals';
import createMatchMedia from '../../helpers/createMatchMedia';
import '@testing-library/jest-dom/extend-expect';

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

it('renders initial state and elements correctly', () => {
  const { getByRole, getByLabelText } = render(<MockUploadDocumentModal />);

  // Check for initial state values
  const modalTitle = getByRole('heading', { name: 'Upload Document' });
  const fileTypeInput = getByRole('combobox');
  const expirationDateInput = getByLabelText('Expiration Date');
  const descriptionInput = getByLabelText('Enter Description');
  const fileUploadButton = getByRole('button', { name: 'Choose file' });

  // Check for the presence of specific elements
  expect(modalTitle).toBeInTheDocument();
  expect(fileTypeInput).toBeInTheDocument();
  expect(expirationDateInput).toBeInTheDocument();
  expect(descriptionInput).toBeInTheDocument();
  expect(fileUploadButton).toBeInTheDocument();
});
