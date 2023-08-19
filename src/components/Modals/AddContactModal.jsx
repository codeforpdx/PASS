// React Imports
import React, { useState } from 'react';
import { useStatusNotification } from '@hooks';
// Material UI Imports
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { runNotification } from '@utils';
import { FormSection } from '../Form';
import useNotification from '../../hooks/useNotification';

/**
 * @memberof Contcts
 * @name renderWebId
 * @param {string} username - username to convert into a webId
 * @returns {URL} A url of the predicted webID
 */
const renderWebId = (username) => {
  const baseUrl = new URL(localStorage.getItem('oidcIssuer'));
  return new URL(`${username}/profile/card#me`, baseUrl);
};

/**
 * AddContactModal Component - Component that allows users to add other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Contacts
 * @name AddContactModal
 * @param {object} props - react props
 * @param {Function} props.addContact  - function to add a contact
 * @param {boolean} props.showAddContactModal - whether to display modal or not
 * @param {Function} props.setShowAddContactModal - toggle modal
 * @returns {React.JSX.Element} - The Add Contact Modal
 */
const AddContactModal = ({ addContact, showAddContactModal, setShowAddContactModal }) => {
  const { state, dispatch } = useStatusNotification();
  const { addNotification } = useNotification();
  const [userGivenName, setUserGivenName] = useState('');
  const [userFamilyName, setUserFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [webId, setWebId] = useState('');

  const wrappedSetUsername = (value) => {
    setUsername(value);
    const renderedWebId = renderWebId(value);
    setWebId(renderedWebId);
  };

  const notifyStartSubmission = (userObject) => {
    if (!userObject.username && !userObject.webId) {
      runNotification(`Operation failed. Reason: No WebId provided`, 5, state, dispatch);
      return;
    }

    if (!userObject.givenName) {
      runNotification(
        `Operation failed. Reason: User's first/given name is not provided`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 2000);
      return;
    }

    if (!userObject.familyName) {
      runNotification(
        `Operation failed. Reason: User's last/family name is not provided`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 2000);
      return;
    }

    dispatch({ type: 'SET_PROCESSING' });

    runNotification(
      `Adding "${userObject.givenName} ${userObject.familyName}" to client list...`,
      5,
      state,
      dispatch
    );
  };

  const handleAddContact = async (event) => {
    event.preventDefault();
    const userObject = {
      givenName: event.target.addUserGivenName.value,
      familyName: event.target.addUserFamilyName.value,
      webId: event.target.addWebId.value
    };

    notifyStartSubmission(userObject, state, dispatch);
    try {
      await addContact(userObject);
    } finally {
      runNotification(
        `"${userObject.givenName} ${userObject.familyName}" added to client list`,
        5,
        state,
        dispatch
      );
      addNotification(
        'success',
        `"${userObject.givenName} ${userObject.familyName}" added to client list`
      );
      setTimeout(() => {
        setUserGivenName('');
        setUserFamilyName('');
        setUsername('');
        setWebId('');
        dispatch({ type: 'CLEAR_PROCESSING' });
        setShowAddContactModal(false);
      }, 2000);
    }
  };

  return (
    <Dialog
      open={showAddContactModal}
      aria-labelledby="dialog-title"
      onClose={() => setShowAddContactModal(false)}
    >
      <FormSection
        title="Add Contact"
        state={state}
        statusType="Status"
        defaultMessage="To be added..."
      >
        <form onSubmit={handleAddContact} autoComplete="off">
          <FormControl fullWidth>
            <TextField
              margin="normal"
              id="add-user-given-name"
              name="addUserGivenName"
              label="First/given name"
              autoComplete="given-name"
              value={userGivenName}
              onChange={(e) => setUserGivenName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
          </FormControl>
          <TextField
            margin="normal"
            id="add-user-last-name"
            name="addUserFamilyName"
            label="Last/family name"
            autoComplete="family-name"
            value={userFamilyName}
            onChange={(e) => setUserFamilyName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            margin="normal"
            id="add-username"
            name="addUsername"
            label="username"
            autoComplete="username"
            value={username}
            onChange={(e) => wrappedSetUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            margin="normal"
            id="add-webId"
            name="addWebId"
            placeholder="WebId"
            autoComplete="webid"
            value={webId}
            type="text"
            onChange={(e) => {
              setWebId(e.target.value);
            }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="copy-webid" edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              endIcon={<ClearIcon />}
              onClick={() => setShowAddContactModal(false)}
              fullWidth
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<CheckIcon />}
              type="submit"
              disabled={state.processing}
              fullWidth
            >
              ADD CLIENT
            </Button>
          </DialogActions>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default AddContactModal;
