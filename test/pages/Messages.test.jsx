import React from 'react';
import { render } from '@testing-library/react';
import { it, describe, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContext, MessageContext } from '@contexts';
import { Messages } from '@pages';

const queryClient = new QueryClient();
const MockMessageContextValue = {
  inboxList: [
    {
      message: 'test 1',
      messageId: '3bf2a18d-0c6a-43e4-9650-992bf4fe7fe7',
      messageUrl:
        'http://localhost:3000/pod-test-name-here/PASS/Inbox/RE%3Ateste-20231023-195931.ttl',
      title: 'RE:teste',
      uploadDate: '2023-10-23T19:59:31.424Z',
      readStatus: false,
      sender: 'PODMAN',
      senderWebId: 'http://localhost:3000/pod-test-name-here/profile/card#me',
      recipient: 'PODMAN'
    }
  ],
  outboxList: [{}],
  setInboxList: vi.fn(),
  setOutboxList: vi.fn(),
  loadMessages: vi.fn(),
  setLoadMessages: vi.fn(),
  updateMessageCountState: vi.fn()
};

const MockSignupContexts = ({ session }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SessionContext.Provider value={session}>
        <MessageContext.Provider value={MockMessageContextValue}>
          <Messages />
        </MessageContext.Provider>
      </SessionContext.Provider>
    </BrowserRouter>
  </QueryClientProvider>
);

describe('Messages Page', () => {
  it('renders', () => {
    const sessionObj = {
      login: vi.fn(),
      fetch: vi.fn(),
      podUrl: 'https://example.com',
      session: {
        info: {
          webId: 'https://example.com/profile/',
          isLoggedIn: true
        }
      }
    };
    const { getByText } = render(<MockSignupContexts session={sessionObj} />);
    expect(getByText('Inbox', { exact: true })).not.toBeNull();
  });

  // TODO
  // update state with react testing lib
  // checkout user event import https://testing-library.com/docs/react-testing-library/example-intro/
  // mock fetch check this: SignedInUserContext.test.jsx see lines 23 & 45 for import fetch mock and return mock with data
});
