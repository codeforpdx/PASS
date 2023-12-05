// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Inrupt Library Imports
import { useMessageList, useNotification, useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Utility Imports
import { sendMessageTTL } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import { FormSection } from '../Form';

/**
 * @typedef {import("../../typedefs.js").messageListObject} messageListObject
 */

/**
 * NewMessageModal Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Modals
 * @name NewMessageModal
 * @param {object} Props - Props used for NewMessageModal
 * @param {boolean} Props.showModal - Boolean for showing message modal
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowModal
 * - React set function for showModal
 * @param {string} Props.toField - URL of the recipient
 * @param {messageListObject|string} Props.oldMessage - The previous message
 * object when using the modal to reply, else uses a string if empty
 * @returns {React.JSX.Element} React component for NewMessageModal
 */
const NewMessageModal = ({ showModal, setShowModal, oldMessage = '', toField = '' }) => {
  const { session } = useSession();
  const { refetch: refreshOutbox } = useMessageList('Outbox');
  const { podUrl } = useContext(SignedInUserContext);
  const { addNotification } = useNotification();
  const [originalMessage, setOriginalMessage] = useState(oldMessage.message);

  const [message, setMessage] = useState({
    recipientPodUrl: oldMessage ? oldMessage.senderWebId.split('profile')[0] : '',
    title: oldMessage ? `RE:${oldMessage.title}`.replace('RE:RE:', 'RE:') : '',
    message: '',
    inReplyTo: oldMessage ? oldMessage.messageId : '',
    messageUrl: oldMessage ? oldMessage.messageUrl : ''
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Modifies message upon input
  const handleChange = (e) => {
    setMessage({
      ...message,
      [e.target.id]: e.target.value
    });
  };

  useEffect(() => {
    if (toField !== '') {
      setMessage({
        ...message,
        recipientPodUrl: toField,
        inReplyTo: '',
        messageUrl: ''
      });
    }
  }, [toField]);

  const handleReplyMessage = () => {
    setShowModal(!showModal);
  };

  // Handles submitting a new message
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const messageWithTrimmedInputs = {
        ...message,
        recipientPodUrl: message.recipientPodUrl.trim(),
        title: message.title.trim(),
        message: message.message.trim()
      };

      await sendMessageTTL(session, messageWithTrimmedInputs, podUrl);

      setMessage({
        recipientPodUrl: '',
        title: '',
        message: ''
      });
      addNotification('success', `Message successfully sent to ${message.recipientPodUrl}`);
    } catch (err) {
      // TODO: Make sure invalid username is the only possible error
      addNotification('error', `Invalid recipient: ${message.recipientPodUrl}`);
    } finally {
      setOriginalMessage('');
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }

    await refreshOutbox();
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <Dialog
      open={showModal}
      aria-labelledby="new-message-modal"
      onClose={() => handleReplyMessage(false)}
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
        <FormSection title={oldMessage ? 'Reply To' : 'New Message'} headingId="new-message-form">
          <form
            aria-labelledby="new-message-form"
            onSubmit={(e) => handleSubmit(e)}
            autoComplete="off"
          >
            <TextField
              margin="normal"
              value={toField || message.recipientPodUrl}
              type="text"
              name="recipientPodUrl"
              id="recipientPodUrl"
              onChange={(e) => handleChange(e)}
              required
              autoFocus
              label="To"
              fullWidth
              disabled={toField !== ''}
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
              inputProps={{ maxLength: '48' }}
              fullWidth
            />
            {oldMessage && (
              <TextField
                margin="normal"
                value={originalMessage}
                type="text"
                name="previousMessage"
                id="previousMessage"
                label="Previous Message"
                variant="filled"
                // TODO: The line below shrinks the "Reply To" version more than the "New Message" one
                // Is this something that needs to be addressed?
                sx={{ display: 'block' }}
                multiline
                rows={3}
                InputProps={{
                  readOnly: true
                }}
                fullWidth
              />
            )}
            <TextField
              margin="normal"
              value={message.message}
              type="text"
              name="message"
              id="message"
              onChange={(e) => handleChange(e)}
              multiline
              rows={5}
              label="Message"
              required
              // TODO: Determine how long a maximum length, if any, is suitable
              inputProps={{ maxLength: '500' }}
              fullWidth
            />
            <DialogActions sx={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isSmallScreen ? 'column' : 'row',
                  gap: isSmallScreen ? '10px' : '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={() => setShowModal(false)}
                  fullWidth
                >
                  Cancel
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
              </Box>
            </DialogActions>
          </form>
        </FormSection>
      </Box>
    </Dialog>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default NewMessageModal;
