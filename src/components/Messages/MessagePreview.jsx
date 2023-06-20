// React imports
import React, { useState } from 'react';
// Styling Imports
import { StyledDate, StyledHeader, StyledPreview } from './MessageStyles';

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @typedef messageFolderProps
 * @type {object}
 * @property {string} message - The content of the message sent
 * @memberof typedefs
 */

/**
 * Message Preview Component - Component that displays message previews from
 * user's Inbox container
 *
 * @memberof Inbox
 * @name MessagePreview
 * @param {messageFolderProps} Props - Component props for MessagePreview
 */

const MessagePreview = ({ message }) => {
  const [showContents, setShowContents] = useState(false);

  const handleClick = () => {
    setShowContents(!showContents);
  };

  return (
    <StyledPreview onClick={() => handleClick()}>
      <StyledDate>{message.uploadDate.toLocaleDateString()}</StyledDate>
      <StyledHeader>
        {message.sender} - {message.title}
      </StyledHeader>
      {showContents && <p style={{ wordWrap: 'break-word' }}>{message.message}</p>}
    </StyledPreview>
  );
};

export default MessagePreview;
