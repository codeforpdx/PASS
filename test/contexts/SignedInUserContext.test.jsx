import { render, cleanup } from '@testing-library/react';
import React, { useContext } from 'react';
import {
  getPodUrlAll,
  getSolidDataset,
  mockSolidDatasetFrom,
  setThing,
  buildThing,
  createThing
} from '@inrupt/solid-client';
import { useSession } from '@hooks';
import dayjs from 'dayjs';
import { expect, it, afterEach, describe, vi } from 'vitest';
import { fetchProfileInfo } from '../../src/model-helpers';
import { SignedInUserContext, SignedInUserContextProvider } from '../../src/contexts';
import { RDF_PREDICATES } from '../../src/constants';

const TestConsumer = () => {
  const { podUrl } = useContext(SignedInUserContext);

  return <div>{podUrl}</div>;
};

vi.mock('@inrupt/solid-client');
vi.mock('@hooks', () => ({
  useSession: vi.fn()
}));
vi.mock('../../src/model-helpers/', async () => {
  const actual = await vi.importActual('../../src/model-helpers/');

  return {
    ...actual,
    fetchProfileInfo: vi.fn()
  };
});

describe('SignedInUserContext', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('fetches user data if user is logged in', async () => {
    const newActiveTTL = buildThing(createThing({ name: 'active' }))
      .addDatetime(RDF_PREDICATES.dateModified, dayjs().$d)
      .build();

    const dataset = mockSolidDatasetFrom('https://example.com/pod/PASS/Public/active.ttl');
    getSolidDataset.mockResolvedValue(setThing(dataset, newActiveTTL));

    useSession.mockReturnValue({
      session: {
        info: {
          isLoggedIn: true,
          webId: 'https://example.com/pod/profile/card#me'
        }
      }
    });
    fetchProfileInfo.mockResolvedValue({ profileInfo: {} });
    getPodUrlAll.mockResolvedValue(['https://example.com/pod/']);
    const { findByText } = render(
      <SignedInUserContextProvider>
        <TestConsumer />
      </SignedInUserContextProvider>
    );
    const val = await findByText('https://example.com/pod/');
    expect(val).not.toBeNull();
  });
});
