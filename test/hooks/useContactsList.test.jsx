import React from 'react';
import { getSolidDataset, mockSolidDatasetFrom } from '@inrupt/solid-client';
import { expect, it, describe, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContactsList } from '@hooks';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@inrupt/solid-client');

const queryClient = new QueryClient();

const sessionInfo = {
  session: {
    info: {
      webId: 'https://example.com/profile'
    }
  }
};

const Wrapper = ({ children }) => (
  <SessionContext.Provider value={sessionInfo}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </SessionContext.Provider>
);

describe('useContactsList', () => {
  it('Returns a list of contacts if list is found', async () => {
    getSolidDataset.mockResolvedValue(
      mockSolidDatasetFrom('https://example.com/PASS/Users/userlist.ttl')
    );
    const { result } = renderHook(useContactsList, { Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.length).toBe(0);
  });
});
