import React from 'react';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMessageList } from '@hooks';
import { getSolidDataset, mockSolidDatasetFrom } from '@inrupt/solid-client';

vi.mock('@inrupt/solid-client');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const sessionInfo = {
  session: {
    info: {
      isLoggedIn: true,
      webId: 'https://example.com/test/profile/card#me'
    }
  }
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <SessionContext.Provider value={sessionInfo}>{children}</SessionContext.Provider>
  </QueryClientProvider>
);

describe('useMessageList', () => {
  it('Returns inbox list if list is found, but an empty list when 0 messages', async () => {
    getSolidDataset.mockResolvedValue(mockSolidDatasetFrom('https://example.com/test/PASS/Inbox/'));
    const { result } = renderHook(() => useMessageList('Inbox'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual([]);
  });
});
