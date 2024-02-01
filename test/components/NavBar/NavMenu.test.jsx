import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { it, expect } from 'vitest';
import { NavMenu } from '@components/NavBar';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import createMatchMedia from '../../helpers/createMatchMedia';

const queryClient = new QueryClient();

const MockNavMenu = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <NavMenu openMenu />
    </BrowserRouter>
  </QueryClientProvider>
);

it('does not render contacts and civic profile links above 600px', () => {
  const { queryByText } = render(<MockNavMenu />);

  const contactsLink = queryByText('Contacts');
  const civicProfileLink = queryByText('Civic Profile');

  expect(contactsLink).toBeNull();
  expect(civicProfileLink).toBeNull();
});

it('renders contacts and civic profile links below 600px', () => {
  window.matchMedia = createMatchMedia(599);
  const { queryByText } = render(<MockNavMenu />);

  const contactsLink = queryByText('Contacts');
  const civicProfileLink = queryByText('Civic Profile');

  expect(contactsLink).not.toBeNull();
  expect(civicProfileLink).not.toBeNull();
});
