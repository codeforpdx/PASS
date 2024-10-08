import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { Profile } from '@pages';
import MockSignedInUserContext from '../mocks/contexts/MockSignedInUserContext';

const queryClient = new QueryClient();

const renderProfile = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MockSignedInUserContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </MockSignedInUserContext>
    </QueryClientProvider>
  );

describe('Profile Page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    act(() => {
      renderProfile();
    });
  });

  it('renders', async () => {
    const heading = await screen.findByRole('heading', { name: 'My Profile' }, { timeout: 2000 });
    expect(heading).toHaveAccessibleName('My Profile');
  });
});
