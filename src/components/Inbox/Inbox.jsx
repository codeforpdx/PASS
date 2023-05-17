import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import styled from 'styled-components';
import { Logout } from '../Login';
import NewMessage from './NewMessage';
import { getInboxMessageTTL } from '../../utils/session-core';
import { InboxMessageContext } from '../../contexts';

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

  // TODO: turn off all eslist-disable after finishing new components for inbox
  // inboxList is the list of message objects from Solid
  // eslint-disable-next-line no-unused-vars
  const { inboxList, setInboxList } = useContext(InboxMessageContext);

  // loadingMessages is the state used for loading
  // eslint-disable-next-line no-unused-vars
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    /**
     * A function that fetch the user's messages from their inbox
     *
     * @function getMessages
     */
    async function getMessages() {
      try {
        const messagesInSolid = await getInboxMessageTTL(session);
        setInboxList(messagesInSolid);
        setLoadingMessages(true);
      } catch {
        setInboxList([]);
        setLoadingMessages(false);
      }
    }

    if (session.info.isLoggedIn) {
      getMessages();
    }
  }, [session.info.isLoggedIn]);

  return (
    <>
      <Logout />
      <section id="inbox" className="panel">
        <StyledButton onClick={() => setShowForm(!showForm)}>New Message</StyledButton>
        {showForm && <NewMessage />}
        <div>Placeholder; inbox contents will go here.</div>
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
