// React Imports
import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Utility Imports
import { getMessageTTL } from '../utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '../contexts';
// Component Imports
import NewMessage from '../components/Messages/NewMessage';
import PaginatedMessages from '../components/Messages/Pagination';

/**
 * Inbox Page - Page that generates PASS Inbox for users logged into a Solid Pod
 * via Solid Session
 *
 * @memberof Pages
 * @name Inbox
 */

// TODO:
const Inbox = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const [showForm, setShowForm] = useState(false);

  const podUrl = useContext(SignedInUserContext);

  const { session } = useSession();
  const {
    inboxList,
    setInboxList,
    loadMessages,
    setLoadMessages
  } = useContext(MessageContext);

  // Handler function for refreshing PASS inbox
  const handleInboxRefresh = async () => {
    setLoadMessages(true);
    const messagesInSolid = await getMessageTTL(session, 'Inbox', inboxList, podUrl);
    messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
    setInboxList(messagesInSolid);
    setLoadMessages(false);
  };

  // Re-sorts messages upon inboxList updating
  useEffect(() => {
    setLoadMessages(true);
    const inboxCopy = inboxList;
    inboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    setInboxList(inboxCopy);
    setLoadMessages(false);
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
