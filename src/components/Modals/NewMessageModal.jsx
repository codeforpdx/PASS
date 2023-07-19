// React Imports
import React, { useState, useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
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
 * @returns {React.JSX.Element} React component for NewMessage
 */
const NewMessageModal = ({ showModal, setShowModal }) => {
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
    <Dialog
      open={showModal}
      aria-labelledby="new-message-modal"
      onClose={() => setShowModal(false)}
    >
      <Box
        // component="form"
        // maxWidth="xs"
        // onSubmit={handleSubmit}
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
            New Message
          </Typography>
          {/* <Box component="form" onSubmit={handleSubmit} noValidate> */}
          {/* <label htmlFor="recipientUsername">To*: </label> */}
          <TextField
            margin="normal"
            value={message.recipientUsername}
            type="text"
            name="recipientUsername"
            id="recipientUsername"
            onChange={(e) => handleChange(e)}
            required
            autoFocus
            label="To"
            fullWidth
          />

          {/* <label htmlFor="title">Subject*: </label> */}
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

          {/* <label htmlFor="message">Message*: </label> */}
          <TextField
            margin="normal"
            name="message"
            id="message"
            multiline
            rows={6}
            label="Enter Message"
            value={message.message}
            onChange={(e) => handleChange(e)}
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
          {/* </Box> */}
        </form>
      </Box>
    </Dialog>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default NewMessageModal;
