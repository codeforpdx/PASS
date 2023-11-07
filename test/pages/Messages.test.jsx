import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, describe, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SessionContext, MessageContext } from '@contexts';
import { Messages } from '@pages';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

const MockMessageContextValue = {
  inboxList: [
    {
      message: 'test message',
      messageId: '3bf2a18d-0c6a-43e4-9650-992bf4fe7fe7',
      messageUrl:
        'http://localhost:3000/pod-test-name-here/PASS/Inbox/RE%3Ateste-20231023-195931.ttl',
      title: 'RE:test-inbox',
      uploadDate: new Date('2023-10-23T19:59:31.424Z'),
      readStatus: false,
      sender: 'PODMAN',
      senderWebId: 'http://localhost:3000/pod-test-name-here/profile/card#me',
      recipient: 'PODMAN'
    },
    {
      message: 'test 3',
      messageId: '3bf2a18d-0c6a-43e4-9650-992bf4fe7fe9',
      messageUrl:
        'http://localhost:3000/pod-test-name-here/PASS/Inbox/RE%3Ateste-20231023-195931.ttl',
      title: 'foo bar',
      uploadDate: new Date('2023-10-23T19:59:31.424Z'),
      readStatus: true,
      sender: 'PODMAN',
      senderWebId: 'http://localhost:3000/pod-test-name-here/profile/card#me',
      recipient: 'PODMAN'
    }
  ],
  outboxList: [
    {
      message: 'test 2',
      messageId: '3bf2a18d-0c6a-43e4-9650-992bf4fe7fe8',
      messageUrl:
        'http://localhost:3000/pod-test-name-here/PASS/Inbox/RE%3Ateste-20231023-195933.ttl',
      title: 'RE:test-outbox',
      uploadDate: new Date('2023-10-23T19:59:31.424Z'),
      readStatus: true,
      sender: 'PODMAN',
      senderWebId: 'http://localhost:3000/pod-test-name-here/profile/card#me',
      recipient: 'PODMAN'
    }
  ],
  setInboxList: vi.fn(),
  setOutboxList: vi.fn(),
  loadMessages: false,
  setLoadMessages: vi.fn(),
  setNumUnreadMessages: 1,
  updateMessageCountState: vi.fn()
};

const MockSignupContexts = ({ session }) => (
  <BrowserRouter>
    <SessionContext.Provider value={session}>
      <MessageContext.Provider value={MockMessageContextValue}>
        <IconButton aria-label="show new messages" datatestid="EmailIcon">
          <Badge badgeContent={MockMessageContextValue.setNumUnreadMessages} color="error" />
        </IconButton>
        <Messages />
      </MessageContext.Provider>
    </SessionContext.Provider>
  </BrowserRouter>
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
    expect(getByText('Outbox', { exact: true })).not.toBeNull();
  });

  it('should render messages', async () => {
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

    const { getByText, queryByText } = render(<MockSignupContexts session={sessionObj} />);
    expect(getByText('RE:test-inbox')).not.toBeNull();
    expect(queryByText('RE:test-outbox')).toBeNull();
  });

  it('should have an unread message', () => {
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

    render(<MockSignupContexts session={sessionObj} />);
    const messageBadge = screen.getAllByText('1', { exact: true })[0];
    const messageLabel = screen.getByLabelText('show new messages');
    expect(messageBadge).not.toBeNull();
    expect(messageLabel).not.toBeNull();
  });

  it('should update state', async () => {
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

    const user = userEvent.setup();
    render(<MockSignupContexts session={sessionObj} />);
    const unreadMessage = screen.queryByText('RE:test-inbox').parentElement;
    expect(unreadMessage).not.toBeNull();
    await user.click(unreadMessage);
    await waitFor(() => expect(MockMessageContextValue.updateMessageCountState).toHaveBeenCalled());
  });
});
