import { render, cleanup } from '@testing-library/react';
import React, { useContext } from 'react';
import { getPodUrlAll } from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';
import { expect, it, afterEach, describe, vi } from 'vitest';
import { SignedInUserContext, SignedInUserContextProvider } from '../../src/contexts';
import flushPromises from '../testHelpers';

const TestConsumer = () => {
  const { podUrl } = useContext(SignedInUserContext);

  return <div>{podUrl}</div>;
};

vi.mock('@inrupt/solid-client');

vi.mock('@inrupt/solid-ui-react', async () => {
  const lib = await vi.importActual('@inrupt/solid-ui-react');
  return {
    ...lib,
    useSession: vi.fn(() => ({
      session: {
        fetch: vi.fn(),
        info: {
          isLoggedIn: false,
          webId: 'https://example.com/'
        }
      }
    }))
  };
});

describe('SignedInUserContext', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('fetches user data if user is logged in', async () => {
    useSession.mockReturnValue({
      session: {
        info: {
          isLoggedIn: true
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
