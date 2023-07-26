// React Imports
import React, { useState, useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Utility Imports
import { sendMessageTTL, getMessageTTL } from '../../utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '../../contexts';

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @typedef newMessageModalProps
 * @type {object}
 * @property {() => void} closeForm - The function used to trigger NewMessageModal to
 * close
 * @memberof typedefs
 */

/**
 * NewMessageModal Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Modals
 * @name NewMessageModal
 * @param {newMessageModalProps} Props - Props used for NewMessageModal
 * @returns {React.JSX.Element} React component for NewMessageModal
 */

const NewMessageModal = ({ showModal, setShowModal, oldMessage = '' }) => {
  const { session } = useSession();
  const { outboxList, setOutboxList } = useContext(MessageContext);
  const { podUrl } = useContext(SignedInUserContext);
  const [originalMessage, setOriginalMessage] = useState(oldMessage.message);

  const [message, setMessage] = useState({
    recipientPodUrl: oldMessage ? oldMessage.senderWebId.split('profile')[0] : '',
    title: oldMessage ? `RE: ${oldMessage.title}`.replace('RE:RE:', 'RE:') : '',
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
    <Dialog
      open={showModal}
      aria-labelledby="new-message-modal"
      onClose={() => setShowModal(false)}
    >
      <Box
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          minWidth: '50%',
          minHeight: '90%'
        }}
      >
        <form onSubmit={(e) => handleSubmit(e)} autoComplete="off">
          <Typography display="flex" justifyContent="center" variant="h5">
            {oldMessage ? 'Reply To' : 'New Message'}
          </Typography>
          <TextField
            margin="normal"
            value={message.recipientPodUrl}
            type="text"
            name="recipientPodUrl"
            id="recipientPodUrl"
            onChange={(e) => handleChange(e)}
            required
            autoFocus
            label="To"
            fullWidth
          />
          <TextField
            margin="normal"
            value={message.title}
            type="text"
            name="title"
            id="title"
            onChange={(e) => handleChange(e)}
            required
            label="Subject"
            inputProps={{ maxLength: '24' }}
            fullWidth
          />
          <TextField
            margin="normal"
            value={oldMessage && originalMessage}
            type="previousMessage"
            name="previousMessage"
            id="previousMessage"
            label="Previous Message"
            // helperText="Previous message"
            // variant="filled"
            multiline
            rows={3}
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />

          <TextField
            margin="normal"
            value={message.message}
            type="text"
            name="message"
            id="message"
            onChange={(e) => handleChange(e)}
            multiline
            rows={6}
            label="Enter Message"
            placeholder="Add a description here"
            required
            fullWidth
          />
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={() => setShowModal(false)}
              fullWidth
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              startIcon={<CheckIcon />}
              fullWidth
            >
              Submit
            </Button>
          </DialogActions>
          {error && <div>{error}</div>}
          {success && successTimeout && <div>{success}</div>}
        </form>
      </Box>
    </Dialog>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default NewMessageModal;
