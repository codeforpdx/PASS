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
import { expect, it, afterEach, describe, vi } from 'vitest';
import { SignedInUserContext, SignedInUserContextProvider } from '../../src/contexts';
import { RDF_PREDICATES } from '../../src/constants';
import flushPromises from '../helpers/testHelpers';

const TestConsumer = () => {
  const { podUrl } = useContext(SignedInUserContext);

  return <div>{podUrl}</div>;
};

vi.mock('@inrupt/solid-client');
vi.mock('@hooks', () => ({
  useSession: vi.fn()
}));

describe('SignedInUserContext', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('fetches user data if user is logged in', async () => {
    const newActiveTTL = buildThing(createThing({ name: 'active' }))
      .addDatetime(RDF_PREDICATES.dateModified, new Date())
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
    getPodUrlAll.mockResolvedValue(['https://example.com/pod/']);
    const { container } = render(
      <SignedInUserContextProvider>
        <TestConsumer />
      </SignedInUserContextProvider>
    );
    await flushPromises();
    expect(container).toMatchSnapshot();
  });
});
