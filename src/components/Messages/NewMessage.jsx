// React Imports
import React, { useState, useContext } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Utility Imports
import { sendMessageTTL, getMessageTTL } from '@utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '@contexts';
// Component Imports
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

/**
 * @typedef {import("../../typedefs.js").newMessageProps} newMessageProps
 */

/**
 * New Message Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Inbox
 * @name NewMessage
 * @param {newMessageProps} Props - Props used for NewMessage
 * @returns {React.JSX.Element} React component for NewMessage
 */
const NewMessage = ({ closeForm, oldMessage = '' }) => {
  const { session } = useSession();
  const { outboxList, setOutboxList } = useContext(MessageContext);
  const { podUrl } = useContext(SignedInUserContext);
  const [originalMessage, setOriginalMessage] = useState(oldMessage.message);

  const [message, setMessage] = useState({
    recipientPodUrl: oldMessage ? oldMessage.senderWebId.split('profile')[0] : '',
    title: oldMessage ? `RE:${oldMessage.title}`.replace('RE:RE:', 'RE:') : '',
    message: '',
    inReplyTo: oldMessage ? oldMessage.messageId : '',
    messageUrl: oldMessage ? oldMessage.messageUrl : ''
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
    } else if (!message.recipientPodUrl) {
      setError('Please enter a value for Recipient Pod URL');
    } else if (!message.message) {
      setError('Please enter a value for the Message');
    } else {
      try {
        await sendMessageTTL(session, message, podUrl);

        setMessage({
          recipientPodUrl: '',
          title: '',
          message: ''
        });
        setError('');
        setSuccess(`Message successfully sent to ${message.recipientPodUrl}`);
        setSuccessTimeout(true);
        setTimeout(() => {
          setSuccessTimeout(false);
        }, 10000);
      } catch (err) {
        // TODO: Make sure invalid username is the only possible error
        setError(err.message);
      } finally {
        setOriginalMessage('');
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

        <StyledHeader2>{oldMessage ? 'Reply To' : 'New Message'}</StyledHeader2>
        <label htmlFor="title">Subject*: </label>
        <StyledInput
          value={message.title}
          type="text"
          name="title"
          id="title"
          onChange={(e) => handleChange(e)}
        />

        <label htmlFor="recipientPodUrl">To*: </label>
        <StyledInput
          value={message.recipientPodUrl}
          type="text"
          name="recipientPodUrl"
          id="recipientPodUrl"
          onChange={(e) => handleChange(e)}
        />

        <div>Original Message:</div>
        <div>{oldMessage && originalMessage}</div>

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
