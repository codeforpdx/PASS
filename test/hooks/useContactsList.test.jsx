import React from 'react';
import {
  buildThing,
  createThing,
  setThing,
  getSolidDataset,
  saveSolidDatasetAt,
  mockSolidDatasetFrom,
  createSolidDataset
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import { expect, it, describe, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContactsList } from '@hooks';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
      webId: 'https://example.com/profile'
    }
  }
};

const wrapper = ({ children }) => (
  <SessionContext.Provider value={sessionInfo}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </SessionContext.Provider>
);

const makeIntoThing = ({ givenName, familyName, webId }) => {
  let builder = buildThing(createThing({ name: encodeURIComponent(webId) }))
    .addUrl(RDF_PREDICATES.identifier, webId)
    .addUrl(RDF_PREDICATES.URL, webId.split('profile')[0]);

  if (givenName) {
    builder = builder.addStringNoLocale(RDF_PREDICATES.givenName, givenName);
  }
  if (familyName) {
    builder = builder.addStringNoLocale(RDF_PREDICATES.familyName, familyName);
  }

  return builder.build();
};

describe('useContactsList', () => {
  const contact = {
    givenName: 'Zoro',
    familyName: 'Roronoa',
    webId: 'http://www.example.com/swords',
    podUrl: 'http://www.example.com/swords',
    thingId: 'http://www.example.com/swords'
  };
  it('Returns a list of contacts if list is found', async () => {
    getSolidDataset.mockResolvedValue(
      mockSolidDatasetFrom('https://example.com/PASS/Users/userlist.ttl')
    );
    const { result } = renderHook(() => useContactsList(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.length).toBe(0);
  });

  it('Creates a new file if none exists', async () => {
    getSolidDataset.mockRejectedValue({ response: { status: 404 } });
    const { result } = renderHook(() => useContactsList(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createSolidDataset).toBeCalledTimes(1);
  });

  it('Adds contact to contacts list', async () => {
    let dataset = mockSolidDatasetFrom('https://example.com/PASS/Users/userlist.ttl');
    getSolidDataset.mockResolvedValue(dataset);
    saveSolidDatasetAt.mockImplementation((_, data) => Promise.resolve(data));
    const thing = makeIntoThing(contact);
    dataset = setThing(dataset, thing);
    const { result } = renderHook(() => useContactsList(), { wrapper });
    await waitFor(() => expect(result.current.storedDataset).not.toBe(null));
    const hook = result.current;
    await hook.add(contact);
    await waitFor(() => expect(result.current.data).toStrictEqual([contact]));
    expect(saveSolidDatasetAt).toBeCalled();
  });

  it('Removes contact from contacts list', async () => {
    let dataset = mockSolidDatasetFrom('https://example.com/PASS/Users/userlist.ttl');
    saveSolidDatasetAt.mockImplementation((_, data) => Promise.resolve(data));
    const thing = makeIntoThing(contact);
    dataset = setThing(dataset, thing);
    getSolidDataset.mockResolvedValue(dataset);
    const { result } = renderHook(() => useContactsList(), { wrapper });
    await waitFor(() => expect(result.current.storedDataset).not.toBe(null));
    const hook = result.current;
    await hook.delete(contact);
    await waitFor(() => expect(saveSolidDatasetAt).toBeCalledTimes(3));
  });
});
