import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShowNewPod } from '@components/Signup';
import isAccessible from '../../utils/axe';

vi.mock('@inrupt/solid-client');

vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom');

  return {
    ...originalModule,
    useSearchParams: () => [new URLSearchParams({ webId: 'https://example.com/profile' })]
  };
});

const queryClient = new QueryClient();

describe('ShowNewPod', () => {
  it('should be accessible', () => {
    isAccessible(
      render(
        <QueryClientProvider client={queryClient}>
          <Router>
            <ShowNewPod oidcIssuer="oidIssuer" />
          </Router>
        </QueryClientProvider>
      )
    );
  });

  it('renders', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ShowNewPod oidcIssuer="oidIssuer" />
        </Router>
      </QueryClientProvider>
    );

    const pod = screen.getByRole('heading');
    expect(pod).not.toBeNull();
  });
});
