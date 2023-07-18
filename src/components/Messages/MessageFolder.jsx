// React Imports
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
// Styling Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { PaginationContainer } from './MessageStyles';
// Component Imports
import MessagePreview from './MessagePreview';
import { EmptyListNotification, LoadingAnimation } from '../Notification';

/**
 * @typedef {import("../../typedefs.js").messageListObject} messageListObject
 */

/**
 * @typedef {import("../../typedefs.js").messageFolderProps} messageFolderProps
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

  const noMessages = <EmptyListNotification type="messages" />;
  const withMessages = currentMessages.map((message) => (
    <MessagePreview key={message.messageId} message={message} folderType={folderType} />
  ));

  const handleMessages = () => {
    if (currentMessages.length > 0) {
      return withMessages;
    }

    return noMessages;
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
        {loadMessages ? <LoadingAnimation loadingItem="messages" /> : handleMessages()}
      </Box>
      <Box>
        <PaginationContainer>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount === 0 ? 1 : pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
          />
        </PaginationContainer>
      </Box>
    </Box>
  );
};

export default MessageFolder;
