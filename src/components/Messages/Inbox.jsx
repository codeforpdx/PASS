// React Imports
import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Unique ID import
import { v4 as uuidv4 } from 'uuid';
// Component Imports
import NewMessage from './NewMessage';
import MessagePreview from './MessagePreview';
import { InboxMessageContext, OutboxMessageContext } from '../../contexts';
import { getMessageTTL } from '../../utils/network/session-core';

/**
 * Inbox Component - Component that generates Inbox section for users
 * logged into a Solid Pod via Solid Session
 *
 * @memberof Inbox
 * @name Inbox
 */

// TODO: Style pagination and move it to outbox as well
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
      {loadMessages ? (
        <div>Loading Messages...</div>
      ) : (
        /* <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {inboxList.map((message) => (
            <MessagePreview key={uuidv4()} message={message} />
          ))}
        </div> */
        <PaginatedMessages messages={inboxList} />
      )}
    </section>
  );
};

// Helper component for displaying paginated results
const Messages = ({ currentMessages }) =>
  currentMessages &&
  currentMessages.map((message) => <MessagePreview key={uuidv4()} message={message} />);

// Helper component for creating pagination
const PaginatedMessages = ({ messages }) => {
  const [offset, setOffset] = useState(0);
  const itemsPerPage = 5;

  const endOffset = offset + itemsPerPage;
  const currentMessages = messages.slice(offset, endOffset);
  const pageCount = Math.ceil(messages.length / itemsPerPage);

  // Handle user changing page
  const handlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % messages.length;
    setOffset(newOffset);
  };

  return (
    <>
      <Messages currentMessages={currentMessages} />
      <PaginationContainer>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      </PaginationContainer>
    </>
  );
};

const PaginationContainer = styled.div`
  ul {
    display: flex;
    justify-content: center;
    list-style-type: none;
    padding: 0;
  }

  li:not(:last-child) {
    margin-right: 4px;
  }

  a {
    color: #000;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #eaeaea;
    cursor: pointer;
  }

  a:active {
    background-color: #555;
    color: #fff;
  }
`;

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
