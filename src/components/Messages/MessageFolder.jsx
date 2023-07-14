// React Imports
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
// Other Library Imports
import { v4 as uuidv4 } from 'uuid';
// Styling Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// Component Imports
import MessagePreview from './MessagePreview';
import { PaginationContainer } from './MessageStyles';

/**
 * @typedef {import("../../typedefs.js").messageListObject} messageListObject
 */

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @typedef messageFolderProps
 * @type {object}
 * @property {string} folderType - The name of the message box, i.e. "inbox" or
 * "outbox"
 * @property {() => Promise<void>} handleRefresh - The handle function for message
 * folder refresh
 * @property {boolean} loadMessages - Boolean for triggering loading message
 * @property {messageListObject[]} messageList - A list of messages from Solid Pod
 * @memberof typedefs
 */

/**
 * MessageFolder Component - The general component used for Message Folders Inbox
 * and Outbox
 *
 * @memberof Messages
 * @name MessageFolder
 * @param {messageFolderProps} Props - Component props for MessageFolder
 * @returns {React.JSX.Element} React component for MessageFolder
 */
const MessageFolder = ({ folderType, handleRefresh, loadMessages, messageList }) => {
  const [offset, setOffset] = useState(0);
  const itemsPerPage = 5;

  const endOffset = offset + itemsPerPage;
  const currentMessages = messageList.slice(offset, endOffset);
  const pageCount = Math.ceil(messageList.length / itemsPerPage);

  // Handle user changing page
  const handlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % messageList.length;
    setOffset(newOffset);
  };

  return (
    <Box
      component="section"
      id={folderType}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        gap: '20px',
        padding: '30px'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Button
          variant="contained"
          onClick={() => handleRefresh(folderType)}
          type="button"
          sx={{ width: '100px' }}
        >
          Refresh
        </Button>
        {loadMessages ? (
          <div>Loading messages...</div>
        ) : (
          currentMessages &&
          currentMessages.map((message) => <MessagePreview key={uuidv4()} message={message} />)
        )}
      </Box>
      <Box>
        <PaginationContainer>
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount === 0 ? 1 : pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            className="pagination"
            previousLinkClassName="page-red"
            previousClassName="chevron"
            nextLinkClassName="page-red"
            nextClassName="chevron"
            pageLinkClassName="page-green"
            activeLinkClassName="active-page"
          />
        </PaginationContainer>
      </Box>
    </Box>
  );
};

export default MessageFolder;
