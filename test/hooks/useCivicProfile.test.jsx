import React from 'react';
import {
  buildThing,
  createThing,
  getSolidDataset,
  mockSolidDatasetFrom,
  createSolidDataset,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import { expect, it, describe, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCivicProfile } from '@hooks';
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

const makeIntoThing = ({ firstName, lastName, dateOfBirth, gender }) =>
  buildThing(createThing({ name: 'Civic Profile' }))
    .addStringNoLocale(RDF_PREDICATES.legalFirstName, firstName)
    .addStringNoLocale(RDF_PREDICATES.legalLastName, lastName)
    .addDate(RDF_PREDICATES.legalDOB, dateOfBirth)
    .addInteger(RDF_PREDICATES.legalGender, gender)
    .build();

describe('useCivicProfile', () => {
  const profile = {
    firstName: 'Luffy',
    lastName: 'Monkey',
    dateOfBirth: new Date('July 21, 1983 12:00:00'),
    gender: 99
  };
  it('Returns empty object if no civic profile is found', async () => {
    getSolidDataset.mockResolvedValue(
      mockSolidDatasetFrom('https://example.com/PASS/Profile/civic_profile.ttl')
    );
    const { result } = renderHook(useCivicProfile, { wrapper });
    await waitFor(() => expect(result.current.storedDataset).not.toBe(null));
    expect(result.current.data).toStrictEqual({});
  });

  it('Creates a new file if none exists', async () => {
    getSolidDataset.mockRejectedValue({ response: { status: 404 } });
    const { result } = renderHook(useCivicProfile, { wrapper });
    await waitFor(() => expect(result.current.storedDataset).not.toBe(null));
    expect(createSolidDataset).toBeCalledTimes(1);
  });

  it('Returns the Civic Profile if found', async () => {
    const thing = buildThing(createThing({ name: 'Civic Profile' }))
      .addStringNoLocale(RDF_PREDICATES.legalFirstName, profile.firstName)
      .addStringNoLocale(RDF_PREDICATES.legalLastName, profile.lastName)
      .addDate(RDF_PREDICATES.legalDOB, profile.dateOfBirth)
      .addInteger(RDF_PREDICATES.legalGender, profile.gender)
      .build();
    const dataset = setThing(
      mockSolidDatasetFrom('https://example.com/PASS/Profile/civic_profile.ttl'),
      thing
    );
    getSolidDataset.mockResolvedValue(dataset);
    const { result } = renderHook(useCivicProfile, { wrapper });
    await waitFor(() => expect(result.current.data).toEqual(expect.objectContaining(profile)));
  });

  it('Updates Civic Profile with proper data', async () => {
    let dataset = mockSolidDatasetFrom('https://example.com/PASS/Profile/civic_profile.ttl');
    getSolidDataset.mockResolvedValue(dataset);
    saveSolidDatasetAt.mockImplementation((_, data) => Promise.resolve(data));
    const thing = makeIntoThing(profile);
    dataset = setThing(dataset, thing);
    const { result } = renderHook(useCivicProfile, { wrapper });
    await waitFor(() => expect(result.current.storedDataset).not.toBe(null));
    const hook = result.current;
    hook.add(profile);
    await waitFor(() => expect(result.current.data).toEqual(expect.objectContaining(profile)));
    expect(saveSolidDatasetAt).toBeCalled();
  });
});
