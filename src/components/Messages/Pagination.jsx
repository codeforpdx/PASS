// React Imports
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
// Styling Imports
import styled from 'styled-components';
// Other Library Imports
import { v4 as uuidv4 } from 'uuid';
// Component Imports
import MessagePreview from './MessagePreview';

/**
 * Messages Component - Component that displays messages and provides pagination
 * for inbox and outbox components.
 *
 * @memberof Messages
 * @name PaginatedMessages
 */

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

// Helper component for displaying paginated results
const Messages = ({ currentMessages }) =>
  currentMessages &&
  currentMessages.map((message) => <MessagePreview key={uuidv4()} message={message} />);

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

export default PaginatedMessages;
