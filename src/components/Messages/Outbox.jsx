// React Imports
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Unique ID import
import { v4 as uuidv4 } from 'uuid';
// Component Imports
import MessagePreview from './MessagePreview';
import { OutboxMessageContext } from '../../contexts';
import { getMessageTTL } from '../../utils/network/session-core';

/**
 * Outbox Component - Component that generates Outbox section for users
 * logged into a Solid Pod via Solid Session
 *
 * @memberof Outbox
 * @name Outbox
 */

// TODO:
const Outbox = ({ loadMessages }) => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const { session } = useSession();
  const { outboxList, setOutboxList } = useContext(OutboxMessageContext);

  // Handler function for refreshing PASS outbox
  const handleOutboxRefresh = async () => {
    const messagesInSolid = await getMessageTTL(session, 'Outbox', outboxList);
    messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(messagesInSolid);
  };

  // Re-sorts messages upon outboxList updating
  useEffect(() => {
    const outboxCopy = outboxList;
    outboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(outboxCopy);
  }, [outboxList]);

  return (
    <section
      id="outbox"
      className="panel"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <StyledButton onClick={handleOutboxRefresh} type="button">
          Refresh
        </StyledButton>
      </div>
      {loadMessages ? (
        <div>Loading Messages...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {outboxList.map((message) => (
            <MessagePreview key={uuidv4()} message={message} />
          ))}
        </div>
      )}
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

export default Outbox;
