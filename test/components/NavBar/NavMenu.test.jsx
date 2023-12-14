import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { it, expect } from 'vitest';
import { NavMenu } from '@components/NavBar';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import createMatchMedia from '../../helpers/createMatchMedia';
import isAccessible from '../../utils/axe';

const queryClient = new QueryClient();

const MockNavMenu = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <NavMenu openMenu />
    </BrowserRouter>
  </QueryClientProvider>
);

// These are set to async/await so that they don't conflict with each other.
// `axe` requires synchronous execution, so if multiple are running at once,
// it can give false positives.
it('should be accessible', async () => {
  await isAccessible(render(<MockNavMenu />));
});

it('does not render contacts and civic profile links above 600px', () => {
  const { queryByText } = render(<MockNavMenu />);

  const contactsLink = queryByText('Contacts');
  const civicProfileLink = queryByText('Civic Profile');

  expect(contactsLink).toBeNull();
  expect(civicProfileLink).toBeNull();
});

it('should be accessible on mobile', async () => {
  window.matchMedia = createMatchMedia(599);
  await isAccessible(render(<MockNavMenu />));
});

it('renders contacts and civic profile links below 600px', () => {
  window.matchMedia = createMatchMedia(599);
  const { queryByText } = render(<MockNavMenu />);

  const contactsLink = queryByText('Contacts');
  const civicProfileLink = queryByText('Civic Profile');

  expect(contactsLink).not.toBeNull();
  expect(civicProfileLink).not.toBeNull();
});
