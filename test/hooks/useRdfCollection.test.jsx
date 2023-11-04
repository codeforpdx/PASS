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
import { expect, it, describe, vi, afterEach, beforeEach } from 'vitest';
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
      webId: 'https://example.com/profile'
    }
  }
};

const wrapper = ({ children }) => (
  <SessionContext.Provider value={sessionInfo}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </SessionContext.Provider>
);
const parse = (data) =>
  getThingAll(data).map((thing) => {
    const model = {};
    model.name = getStringNoLocale(thing, RDF_PREDICATES.name);
    return model;
  });

const serialize = ({ name }) =>
  buildThing(createThing({ name })).addStringNoLocale(RDF_PREDICATES.name, name).build();

describe('useRdfCollection', () => {
  let thing;
  let dataset;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    thing = serialize({ name: 'tim' });
    dataset = setThing(mockSolidDatasetFrom('https://www.example.com'), thing);
  });

  it('parses a dataset into the expected format', async () => {
    getSolidDataset.mockResolvedValue(dataset);
    const { result } = renderHook(
      () => useRdfCollection(parse, serialize, 'http://www.example.com/testfile.ttl', vi.fn()),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data[0].name).toBe('tim');
  });

  it('allows you to add to a dataset', async () => {
    getSolidDataset.mockResolvedValue(dataset);
    saveSolidDatasetAt.mockImplementation((_, data) => Promise.resolve(data));
    const { result } = renderHook(
      () => useRdfCollection(parse, serialize, 'http://www.example.com/testfile.ttl', vi.fn()),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const hook = result.current;
    hook.add({ name: 'john' });
    await waitFor(() => expect(result.current.data.length).toBe(2));
    expect(result.current.data[1].name).toBe('john');
  });

  it('allows you to delete from a dataset', async () => {
    getSolidDataset.mockResolvedValue(dataset);
    saveSolidDatasetAt.mockImplementation((_, data) => Promise.resolve(data));
    const { result } = renderHook(
      () => useRdfCollection(parse, serialize, 'http://www.example.com/testfile.ttl', vi.fn()),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const hook = result.current;
    hook.add({ name: 'john' });
    await waitFor(() => expect(result.current.data.length).toBe(2));
    hook.delete('john');
    await waitFor(() => expect(result.current.data.length).toBe(1));
  });
});
