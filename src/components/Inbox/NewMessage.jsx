import React, { useState } from 'react';
import styled from 'styled-components';
import { useSession } from '@inrupt/solid-ui-react';
import { sendMessageTTL } from '../../utils';

/**
 * New Message Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Inbox
 * @name NewMessage
 */

const NewMessage = () => {
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
        setError('Recipient username does not exist');
      }
    }
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <StyledForm onSubmit={(e) => handleSubmit(e)} autoComplete="off">
      <StyledNotice>* indicates a required field</StyledNotice>

      <StyledHeader>New Message</StyledHeader>
      <label htmlFor="title">Message Title*: </label>
      <StyledInput
        value={message.title}
        type="text"
        name="title"
        id="title"
        onChange={(e) => handleChange(e)}
      />

      <label htmlFor="recipientUsername">Recipient Username*: </label>
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
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

const StyledForm = styled('form')({
  display: 'grid',
  gridTemplateColumns: '150px 400px',
  gap: '10px',
  margin: '20px',
  border: '2px solid black',
  borderRadius: '8px',
  padding: '20px',
  alignItems: 'center'
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
  cursor: 'pointer'
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
