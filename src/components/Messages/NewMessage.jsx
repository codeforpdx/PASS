// React Imports
import React, { useState, useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Styling Imports
import {
  CancelButton,
  StyledButton2,
  StyledError,
  StyledForm,
  StyledHeader2,
  StyledInput,
  StyledNotice,
  StyledOverlay,
  StyledSuccess,
  StyledTextArea
} from './MessageStyles';
// Utility Imports
import { sendMessageTTL, getMessageTTL } from '../../utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '../../contexts';

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @typedef newMessageProps
 * @type {object}
 * @property {() => void} closeForm - The function used to trigger NewMessage to
 * close
 * @memberof typedefs
 */

/**
 * New Message Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Inbox
 * @name NewMessage
 * @param {newMessageProps} Props - Props used for NewMessage
 */

const NewMessage = ({ closeForm }) => {
  const { session } = useSession();
  const { outboxList, setOutboxList } = useContext(MessageContext);
  const { podUrl } = useContext(SignedInUserContext);

  const [message, setMessage] = useState({
    recipientUsername: '',
    title: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successTimeout, setSuccessTimeout] = useState(false);

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
        await sendMessageTTL(session, message, podUrl);

        setMessage({
          recipientUsername: '',
          title: '',
          message: ''
        });
        setError('');
        setSuccess(`Message successfully sent to ${message.recipientUsername}`);
        setSuccessTimeout(true);
        setTimeout(() => {
          setSuccessTimeout(false);
        }, 10000);
      } catch (err) {
        // TODO: Make sure invalid username is the only possible error
        setError(err.message);
      }
    }

    // Re-sorts messages when new message is added to outboxList
    const outboxMessages = await getMessageTTL(session, 'Outbox', outboxList, podUrl);
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

        <StyledHeader2>New Message</StyledHeader2>
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

        <StyledButton2 type="submit">Submit</StyledButton2>

        {error && <StyledError>{error}</StyledError>}
        {success && successTimeout && <StyledSuccess>{success}</StyledSuccess>}
      </StyledForm>
    </StyledOverlay>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default NewMessage;
