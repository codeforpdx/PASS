import React from 'react';
import { expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { NewMessageModal } from '@components/Modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import createMatchMedia from '../../helpers/createMatchMedia';

const queryClient = new QueryClient();

const MockNewMessageModal = () => (
  <QueryClientProvider client={queryClient}>
    <NewMessageModal showModal />
  </QueryClientProvider>
);

it('renders button group flex-direction as row default', () => {
  const { getByRole } = render(<MockNewMessageModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button group flex-direction as column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByRole } = render(<MockNewMessageModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});
