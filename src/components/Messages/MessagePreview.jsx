// React imports
import React, { useState } from 'react';
// Styling Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { StyledDate, StyledHeader, StyledPreview } from './MessageStyles';
// Component Imports
import NewMessage from './NewMessage';

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
 * @returns {React.JSX.Element} React component for MessagePreview
 */
const MessagePreview = ({ message }) => {
  const [showContents, setShowContents] = useState(false);
  const [replyMessage, setReplyMessage] = useState(false);

  const handleClick = () => {
    setShowContents(!showContents);
  };

  const handleReplyMessage = () => {
    setReplyMessage(!replyMessage);
  };

  return (
    <StyledPreview onClick={() => handleClick()}>
      <StyledDate>{message.uploadDate.toLocaleDateString()}</StyledDate>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <StyledHeader>
          {message.sender} - {message.title}
        </StyledHeader>
        {showContents && (
          <Button variant="outlined" type="button" onClick={handleReplyMessage}>
            Reply
          </Button>
        )}
      </Box>
      {showContents && (
        <Box sx={{ display: 'flex', flexDirection: 'column', margin: 3, gap: '10px' }}>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>Content:</Typography>
            <Box>
              {message.message.split('\n').map((line) => (
                <Typography sx={{ wordWrap: 'break-word' }}>{line}</Typography>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      {replyMessage && <NewMessage oldMessage={message} closeForm={() => setReplyMessage(false)} />}
    </StyledPreview>
  );
};

export default MessagePreview;
