// React Imports
import React, { useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Import
import styled from 'styled-components';
// Utility Imports
import { sendMessageTTL } from '../../utils';
import { getMessageTTL } from '../../utils/network/session-core';

/**
 * New Message Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Inbox
 * @name NewMessage
 */

const NewMessage = ({ closeForm, outboxList, setOutboxList }) => {
  const { session } = useSession();

  const [message, setMessage] = useState({
    recipientUsername: '',
    title: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modifies message upon input
  const handleChange = (e) => {
    setMessage({
      ...message,
      [e.target.id]: e.target.value
    });
  };

  // Handles submit (awaiting functionality for this)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.title) {
      setError('Please enter a value for Message Title');
    } else if (!message.recipientUsername) {
      setError('Please enter a value for Recipient Username');
    } else if (!message.message) {
      setError('Please enter a value for the Message');
    } else {
      try {
        await sendMessageTTL(session, message);

        setMessage({
          recipientUsername: '',
          title: '',
          message: ''
        });
        setError('');
        setSuccess(`Message successfully sent to ${message.recipientUsername}`);
      } catch (err) {
        // TODO: Make sure invalid username is the only possible error
        setError(err.message);
      }
    }

    // Re-sorts messages when new message is added to outboxList
    const outboxMessages = await getMessageTTL(session, 'Outbox', outboxList);
    const sortedOutbox = outboxMessages;
    sortedOutbox.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(sortedOutbox);
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <StyledOverlay>
      <StyledForm onSubmit={(e) => handleSubmit(e)} autoComplete="off">
        <CancelButton type="button" onClick={closeForm}>
          Cancel
        </CancelButton>
        <StyledNotice>* indicates a required field</StyledNotice>

        <StyledHeader>New Message</StyledHeader>
        <label htmlFor="title">Subject*: </label>
        <StyledInput
          value={message.title}
          type="text"
          name="title"
          id="title"
          onChange={(e) => handleChange(e)}
        />

        <label htmlFor="recipientUsername">To*: </label>
        <StyledInput
          value={message.recipientUsername}
          type="text"
          name="recipientUsername"
          id="recipientUsername"
          onChange={(e) => handleChange(e)}
        />

        <label htmlFor="message">Message*: </label>
        <StyledTextArea
          value={message.message}
          name="message"
          id="message"
          onChange={(e) => handleChange(e)}
        />

        <StyledButton type="submit">Submit</StyledButton>

        {error && <StyledError>{error}</StyledError>}
        {success && <StyledSuccess>{success}</StyledSuccess>}
      </StyledForm>
    </StyledOverlay>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

const StyledOverlay = styled('div')({
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgb(128, 128, 128, .7)',
  backdropFilter: 'blur(2px)',
  zIndex: 99,
  top: '0%',
  left: '0%',
  position: 'fixed'
});

const StyledForm = styled('form')({
  display: 'grid',
  backgroundColor: '#fff',
  gridTemplateColumns: '150px 400px',
  gap: '10px',
  margin: '20px',
  border: '2px solid black',
  borderRadius: '8px',
  padding: '20px',
  alignItems: 'center',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 99
});

const CancelButton = styled('button')({
  gridColumn: '2 / 3',
  width: '150px',
  justifySelf: 'end',
  height: '35px',
  backgroundColor: 'red',
  borderRadius: '5px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(0.9)'
  }
});

const StyledNotice = styled('p')({
  gridColumn: 'span 2',
  fontStyle: 'italic'
});

const StyledButton = styled('button')({
  gridColumn: 'span 2',
  width: '100px',
  height: '30px',
  justifySelf: 'center',
  cursor: 'pointer',
  backgroundColor: '#017969',
  border: 'none',
  borderRadius: '5px',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': {
    filter: 'brightness(0.9)'
  }
});

const StyledError = styled('p')({
  gridColumn: 'span 2',
  fontStyle: 'italic',
  color: 'red',
  justifySelf: 'center'
});

const StyledSuccess = styled('p')({
  gridColumn: 'span 2',
  fontStyle: 'italic',
  color: 'green',
  justifySelf: 'center'
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
