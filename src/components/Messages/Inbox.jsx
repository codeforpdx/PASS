// React Imports
import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Component Imports
import NewMessage from './NewMessage';
import PaginatedMessages from './Pagination';
import { InboxMessageContext, OutboxMessageContext } from '../../contexts';
import { getMessageTTL } from '../../utils/network/session-core';

/**
 * Inbox Component - Component that generates Inbox section for users
 * logged into a Solid Pod via Solid Session
 *
 * @memberof Inbox
 * @name Inbox
 */

const Inbox = ({ loadMessages }) => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const [showForm, setShowForm] = useState(false);

  const { session } = useSession();
  const { inboxList, setInboxList } = useContext(InboxMessageContext);
  const { outboxList, setOutboxList } = useContext(OutboxMessageContext);

  // Handler function for refreshing PASS inbox
  const handleInboxRefresh = async () => {
    const messagesInSolid = await getMessageTTL(session, 'Inbox', inboxList);
    messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
    setInboxList(messagesInSolid);
  };

  // Re-sorts messages upon inboxList updating
  useEffect(() => {
    const inboxCopy = inboxList;
    inboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    setInboxList(inboxCopy);
  }, [inboxList]);

  return (
    <section
      id="inbox"
      className="panel"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <StyledButton onClick={() => setShowForm(!showForm)}>New Message</StyledButton>
        <StyledButton onClick={handleInboxRefresh} type="button">
          Refresh
        </StyledButton>
      </div>
      {showForm && (
        <NewMessage
          closeForm={() => setShowForm(!showForm)}
          outboxList={outboxList}
          setOutboxList={setOutboxList}
        />
      )}
      {loadMessages ? <div>Loading Messages...</div> : <PaginatedMessages messages={inboxList} />}
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
