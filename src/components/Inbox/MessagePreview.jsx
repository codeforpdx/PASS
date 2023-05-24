// React imports
import React, { useState } from 'react';
// Styling Imports
import styled from 'styled-components';

/**
 * Message Preview Component - Component that displays message previews from
 * user's Inbox container
 *
 * @memberof Inbox
 * @name MessagePreview
 */

const MessagePreview = ({ message }) => {
  const [showContents, setShowContents] = useState(false);

  const handleClick = () => {
    setShowContents(!showContents);
  };

  return (
    <StyledPreview onClick={() => handleClick()}>
      <StyledDate>{message.date}</StyledDate>
      <StyledHeader>
        {message.author} - {message.title}
      </StyledHeader>
      {showContents && <p>{message.contents}</p>}
    </StyledPreview>
  );
};

const StyledPreview = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  border: '2px solid black',
  borderRadius: '10px',
  padding: '5px',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '2px 3px 2px rgba(0, 0, 0, .4)'
  }
});

const StyledDate = styled('p')({
  margin: 0,
  padding: 0
});

const StyledHeader = styled('h1')({
  margin: 0,
  padding: 0,
  fontSize: '1.2rem'
});

export default MessagePreview;
