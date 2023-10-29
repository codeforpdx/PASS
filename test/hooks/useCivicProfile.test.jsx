import React from 'react';
import {
  buildThing,
  createThing,
  getSolidDataset,
  mockSolidDatasetFrom,
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

describe('useCivicProfile', () => {
  it('Returns empty object if no civic profile is found', async () => {
    getSolidDataset.mockResolvedValue(
      mockSolidDatasetFrom('https://example.com/PASS/AdditionalProfiles/civic_profile.ttl')
    );
    const { result } = renderHook(useCivicProfile, { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual({});
  });

  it('Returns the Civic Profile if found', async () => {
    const profile = {
      firstName: 'Luffy',
      lastName: 'Monkey',
      dateOfBirth: new Date('July 21, 1983 12:00:00'),
      gender: 99
    };
    const thing = buildThing(createThing({ name: 'Civic Profile' }))
      .addStringNoLocale(RDF_PREDICATES.legalFirstName, profile.firstName)
      .addStringNoLocale(RDF_PREDICATES.legalLastName, profile.lastName)
      .addDate(RDF_PREDICATES.legalDOB, profile.dateOfBirth)
      .addInteger(RDF_PREDICATES.legalGender, profile.gender)
      .build();
    const dataset = setThing(
      mockSolidDatasetFrom('https://example.com/PASS/AdditionalProfiles/civic_profile.ttl'),
      thing
    );
    getSolidDataset.mockResolvedValue(dataset);
    const { result } = renderHook(useCivicProfile, { wrapper });
    await waitFor(() => expect(result.current.data).toStrictEqual(profile));
    expect(result.current.data).toStrictEqual(profile);
  });

  it('Updates Civic Profile with proper data', async () => {});
});
