import React from 'react';
import {
  buildThing,
  createThing,
  setThing,
  getSolidDataset,
  saveSolidDatasetAt,
  mockSolidDatasetFrom,
  getThingAll,
  getStringNoLocale
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import { expect, it, describe, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useRdfCollection from '@hooks/useRdfCollection';

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
      webId: 'http://example.com/profile'
    }
  }
};

const wrapper = ({ children }) => (
  <SessionContext.Provider value={sessionInfo}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </SessionContext.Provider>
);

describe('useRdfCollection', () => {
  const parse = (data) =>
    getThingAll(data).map((newThing) => {
      const model = {};
      model.name = getStringNoLocale(newThing, RDF_PREDICATES.name);
      return model;
    });

  const serialize = ({ name }) =>
    buildThing(createThing({ name })).addStringNoLocale(RDF_PREDICATES.name, name).build();

  it('parses a dataset into the expected format', async () => {
    const thing = serialize({ name: 'tim' });
    const dataset = setThing(mockSolidDatasetFrom('http://www.example.com'), thing);
    getSolidDataset.mockResolvedValue(dataset);
    const { result } = renderHook(
      () => useRdfCollection(parse, serialize, new URL('http://www.example.com'), vi.fn()),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data[0].name).toBe('tim');
  });

  it('allows you to add to a dataset', async () => {
    const dataset = mockSolidDatasetFrom('http://www.example.com');
    getSolidDataset.mockResolvedValue(dataset);
    saveSolidDatasetAt.mockImplementation((_, data) => Promise.resolve(data));
    const { result } = renderHook(
      () => useRdfCollection(parse, serialize, new URL('http://www.example.com'), vi.fn()),
      { wrapper }
    );
    await waitFor(() => expect(getThingAll(result.current.storedDataset).length).toBe(0));
    const hook = result.current;
    await hook.add({ name: 'john' });
    await waitFor(() => expect(getThingAll(result.current.storedDataset).length).toBe(1));
    await hook.add({ name: 'tim' });
    await waitFor(() => expect(getThingAll(result.current.storedDataset).length).toBe(2));
    expect(result.current.data[1].name).toBe('tim');
  });

  it('allows you to delete from a dataset', async () => {
    const dataset = mockSolidDatasetFrom('http://www.example.com');
    getSolidDataset.mockResolvedValue(dataset);
    saveSolidDatasetAt.mockImplementation((_, data) => Promise.resolve(data));
    const { result } = renderHook(
      () => useRdfCollection(parse, serialize, new URL('http://www.example.com'), vi.fn()),
      { wrapper }
    );
    await waitFor(() => expect(getThingAll(result.current.storedDataset).length).toBe(0));
    await result.current.add({ name: 'john' });
    await waitFor(() => expect(getThingAll(result.current.storedDataset).length).toBe(1));
    await result.current.add({ name: 'tim' });
    await waitFor(() => expect(getThingAll(result.current.storedDataset).length).toBe(2));
    await result.current.delete('john');
    await waitFor(
      () =>
        expect(getThingAll(result.current.storedDataset).length).toBe(1) &&
        expect(result.current.isSuccess).toBe(true)
    );
    expect(parse(result.current.storedDataset)[0].name).toBe('tim');
  });
});
