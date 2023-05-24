// React Imports
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Component Imports
import NewMessage from './NewMessage';
import MessagePreview from './MessagePreview';
import { InboxMessageContext } from '../../contexts';
import { getInboxMessageTTL } from '../../utils/network/session-core';

/**
 * Inbox Component - Component that generates Inbox section for users
 * logged into a Solid Pod via Solid Session
 *
 * @memberof Inbox
 * @name Inbox
 */

const Inbox = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const [showForm, setShowForm] = useState(false);
  // messages currently filled with placeholder data
  // Will be updated to pull data from user Inbox using Solid SDK
  const [messages, setMessages] = useState([
    {
      id: 1,
      title: 'Message 1',
      date: 'May 24, 2023',
      author: 'Author 1',
      contents: 'Hello, Inbox!'
    },
    {
      id: 2,
      title: 'Message 2',
      date: 'May 22, 2023',
      author: 'Author 2',
      contents: 'Hello again, Inbox!'
    }
  ]);

  const { session } = useSession();
  const { inboxList, setInboxList } = useContext(InboxMessageContext);

  // Handler function for refreshing PASS inbox
  const handleInboxRefresh = async () => {
    const messagesInSolid = await getInboxMessageTTL(session, inboxList);
    setInboxList(messagesInSolid);
  };

  return (
    <section
      id="inbox"
      className="panel"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <StyledButton onClick={() => setShowForm(!showForm)}>New Message</StyledButton>
      {showForm && <NewMessage closeForm={() => setShowForm(!showForm)} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {messages.map((message) => (
          // TODO: Update key to be truly unique
          <MessagePreview key={message.id} message={message} />
        ))}
      </div>
      <button onClick={handleInboxRefresh} type="button" style={{ width: '150px', height: '50px' }}>
        Refresh
      </button>
    </section>
  );
};

const StyledButton = styled('button')({
  width: '150px',
  height: '60px',
  backgroundColor: '#017969',
  borderColor: 'black',
  borderRadius: '5px',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(0.9)'
  },
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '18px'
});

export default Inbox;
