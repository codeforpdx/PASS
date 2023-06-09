// React Imports
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Utility Imports
import { getMessageTTL } from '../utils';
// Context Imports
import { MessageContext } from '../contexts';
// Component Imports
import PaginatedMessages from '../components/Messages/Pagination';

/**
 * Outbox Page - Component that generates the Outbox Page on Solid
 *
 * @memberof Pages
 * @name Outbox
 */

const Outbox = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const { session } = useSession();
  const { outboxList, setOutboxList, loadMessages, setLoadMessages } = useContext(MessageContext);

  const podUrl = session.info.webId.split('profile')[0];

  // Handler function for refreshing PASS outbox
  const handleOutboxRefresh = async () => {
    setLoadMessages(true);
    const messagesInSolid = await getMessageTTL(session, 'Outbox', outboxList, podUrl);
    messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(messagesInSolid);
    setLoadMessages(false);
  };

  // Re-sorts messages upon outboxList updating
  useEffect(() => {
    setLoadMessages(true);
    const outboxCopy = outboxList;
    outboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(outboxCopy);
    setLoadMessages(false);
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
      {loadMessages ? <div>Loading Messages...</div> : <PaginatedMessages messages={outboxList} />}
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
