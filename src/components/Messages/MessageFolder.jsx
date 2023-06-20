// React Imports
import React, { useState } from 'react';
// Styling Imports
import { StyledButton } from './MessageStyles';
// Component Imports
import PaginatedMessages from './Pagination';
import NewMessage from './NewMessage';

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
 */

const MessageFolder = ({ folderType, handleRefresh, loadMessages, messageList }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <section
      id={folderType}
      className="panel"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        {folderType === 'inbox' && (
          <StyledButton onClick={() => setShowForm(!showForm)}>New Message</StyledButton>
        )}
        <StyledButton onClick={handleRefresh} type="button">
          Refresh
        </StyledButton>
      </div>
      {showForm && <NewMessage closeForm={() => setShowForm(!showForm)} />}
      {loadMessages ? <div>Loading Messages...</div> : <PaginatedMessages messages={messageList} />}
    </section>
  );
};

export default MessageFolder;
