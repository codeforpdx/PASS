import { render, cleanup } from '@testing-library/react';
import React, { useContext } from 'react';
import { getPodUrlAll } from '@inrupt/solid-client';
import { expect, it, afterEach, describe, vi } from 'vitest';
import { SignedInUserContext, SignedInUserContextProvider } from '../../src/contexts';
import flushPromises from '../testHelpers';

const TestConsumer = () => {
  const { podUrl } = useContext(SignedInUserContext);

  return <div>{podUrl}</div>;
};

vi.mock('@inrupt/solid-client');

describe('SignedInUserContext', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('fetches the user properties and passes them to the consumer', async () => {
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
