// React Imports
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
// Other Library Imports
import { v4 as uuidv4 } from 'uuid';
// Styling Imports
import { PaginationContainer } from './MessageStyles';
// Component Imports
import MessagePreview from './MessagePreview';

/**
 * @typedef {import("../../typedefs.js").messageListObject} messageListObject
 */

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @typedef paginatedMessageProps
 * @type {object}
 * @property {messageListObject[]} messages - A list of messages from Solid Pod
 * @memberof typedefs
 */

/**
 * PaginatedMessages Component - Component that displays messages and provides
 * pagination for inbox and outbox components.
 *
 * @memberof Messages
 * @name PaginatedMessages
 * @param {paginatedMessageProps} Props - The props for PaginatedMessages
 * @returns {React.JSX.Element} React component for PaginatedMessages
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
      {currentMessages &&
        currentMessages.map((message) => <MessagePreview key={uuidv4()} message={message} />)}
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

export default PaginatedMessages;
