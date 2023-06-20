// React Imports
import React from 'react';
// Styling Imports
import Box from '@mui/material/Box';
import { StyledButton } from './MessageStyles';
// Component Imports
import PaginatedMessages from './Pagination';

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
const MessageFolder = ({ folderType, handleRefresh, loadMessages, messageList }) => (
  <Box
    component="section"
    id={folderType}
    className="panel"
    style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
  >
    <Box sx={{ display: 'flex', gap: '10px' }}>
      <StyledButton onClick={() => handleRefresh(folderType)} type="button">
        Refresh
      </StyledButton>
    </Box>
    {loadMessages ? <div>Loading Messages...</div> : <PaginatedMessages messages={messageList} />}
  </Box>
);

export default MessageFolder;
