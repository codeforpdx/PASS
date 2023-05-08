import React, { useState } from 'react';
import styled from 'styled-components';

/**
 * New Message Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Inbox
 * @name NewMessage
 */

const NewMessage = () => {
  // Structure of message will likely change
  const [message, setMessage] = useState({
    authorName: '',
    recipientName: '',
    recipientUsername: '',
    message: ''
  });

  // Modifies message upon input
  const handleChange = (e) => {
    setMessage({
      ...message,
      [e.target.id]: e.target.value
    });
  };

  // Handles submit (awaiting functionality for this)
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <StyledForm onSubmit={(e) => handleSubmit(e)}>
      <StyledHeader>New Message</StyledHeader>
      <label htmlFor="recipientUsername">Recipient Username: </label>
      <StyledInput type="text" name="recipientUsername" id="recipientUsername" onChange={(e) => handleChange(e)} />

      <label htmlFor="recipientFullname">Recipient Full Name: </label>
      <StyledInput type="text" name="recipientFullname" id="recipientFullname" onChange={(e) => handleChange(e)} />

      <label htmlFor="message">Message: </label>
      <StyledTextArea name="message" id="message" onChange={(e) => handleChange(e)} />

      <label htmlFor="authorName">Author Full Name: </label>
      <StyledInput type="text" name="authorName" id="authorName" onChange={(e) => handleChange(e)} />

      <StyledButton type="submit">Submit</StyledButton>
    </StyledForm>
  );
};

const StyledForm = styled('form')({
  display: 'grid',
  gridTemplateColumns: '150px 400px',
  gap: '10px',
  margin: '20px',
  border: '2px solid black',
  borderRadius: '8px',
  padding: '20px',
  alignItems: 'center',
});

const StyledButton = styled('button')({
  gridColumn: 'span 2',
  width: '100px',
  height: '30px',
  justifySelf: 'center',
  cursor: 'pointer'
});

const StyledInput = styled('input')({
  height: '30px'
});

const StyledTextArea = styled('textarea')({
  height: '200px'
});

const StyledHeader = styled('h1')({
  gridColumn: 'span 2'
});

export default NewMessage;
