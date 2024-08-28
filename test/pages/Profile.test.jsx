import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { Profile } from '@pages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const renderProfile = () => render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  </QueryClientProvider>
);

describe('Profile Page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with proper components', async () => {
    renderProfile();

    const heading = await screen.findByRole("heading", { name: "My Profile" }, { timeout: 10, interval: 1 });
    expect(heading).toHaveAccessibleName("My Profile");
  })
})
