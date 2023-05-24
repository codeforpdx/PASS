// React Imports
import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Unique ID import
import { v4 as uuidv4 } from 'uuid';
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

// TODO:
const Inbox = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const [showForm, setShowForm] = useState(false);

  const { session } = useSession();
  const { inboxList, setInboxList } = useContext(InboxMessageContext);

  // Handler function for refreshing PASS inbox
  const handleInboxRefresh = async () => {
    const messagesInSolid = await getInboxMessageTTL(session, inboxList);
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
          inboxList={inboxList}
          setInboxList={setInboxList}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {inboxList.map((message) => (
          <MessagePreview key={uuidv4()} message={message} />
        ))}
      </div>
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
