// React imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// Styling Imports
import { StyledDate, StyledHeader, StyledPreview } from './MessageStyles';
// Component Imports
import { NewMessageModal } from '../Modals';

/**
 * @typedef {import("../../typedefs.js").messagePreviewProps} messagePreviewProps
 */

/**
 * Message Preview Component - Component that displays message previews from
 * user's Inbox container
 *
 * @memberof Messages
 * @name MessagePreview
 * @param {messagePreviewProps} Props - Component props for MessagePreview
 * @returns {React.JSX.Element} React component for MessagePreview
 */
const MessagePreview = ({ message, folderType }) => {
  const [showContents, setShowContents] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowContents(!showContents);
  };

  const handleReplyMessage = () => {
    setShowModal(!showModal);
  };

  return (
    <StyledPreview onClick={() => handleClick()}>
      <StyledDate>{message.uploadDate.toLocaleDateString()}</StyledDate>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <StyledHeader>
          {message.sender} - {message.title}
        </StyledHeader>
        {showContents && folderType === 'Inbox' && (
          <Button variant="contained" type="button" onClick={handleReplyMessage}>
            Reply
          </Button>
        )}
      </Box>
      {showContents && (
        <Box sx={{ display: 'flex', flexDirection: 'column', margin: 3, gap: '10px' }}>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>Content:</Typography>
            <Box>
              {message.message.split('\n').map((line, index) => (
                <Typography sx={{ wordWrap: 'break-word' }} key={line + String(index)}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      {showModal && (
        <NewMessageModal showModal={showModal} setShowModal={setShowModal} oldMessage={message} />
      )}
    </StyledPreview>
  );
};

export default MessagePreview;
