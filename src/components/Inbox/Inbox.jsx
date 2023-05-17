import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import styled from 'styled-components';
import { Logout } from '../Login';
import NewMessage from './NewMessage';
import { InboxMessageContext } from '../../contexts';
import { getInboxMessageTTL } from '../../utils/session-core';

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

  const { session } = useSession();
  const { inboxList, setInboxList } = useContext(InboxMessageContext);

  // Handler function for refreshing PASS inbox
  const handleInboxRefresh = async () => {
    const messagesInSolid = await getInboxMessageTTL(session, inboxList);
    setInboxList(messagesInSolid);
  };

  return (
    <>
      <Logout />
      <section id="inbox" className="panel">
        <StyledButton onClick={() => setShowForm(!showForm)}>New Message</StyledButton>
        {showForm && <NewMessage />}
        <div>Placeholder; inbox contents will go here.</div>
        <button onClick={handleInboxRefresh} type="button">
          Refresh
        </button>
      </section>
    </>
  );
};

const StyledButton = styled('button')({
  width: '150px',
  height: '60px',
  backgroundColor: '#4cb4c6',
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
