// React Imports
import React, { useContext, useState } from 'react';
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
// Utility Imports
import { runNotification } from '@utils';
// Context Imports
import { UserListContext } from '@contexts';
import useNotification from '../../hooks/useNotification';
// Model Imports
import { createUser } from '../../model-helpers/User';
// Component Imports
import { FormSection } from '../Form';

/**
 * AddClientModal Component - Component that allows users to add other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Modals
 * @name AddClientModal
 */

const renderWebId = (username) => {
  const baseUrl = new URL(localStorage.getItem('oidcIssuer'));
  return new URL(`${username}/profile/card#me`, baseUrl);
};

const AddClientModal = ({ showAddClientModal, setShowAddClientModal }) => {
  const { state, dispatch } = useStatusNotification();
  const { addNotification } = useNotification();
  const [userGivenName, setUserGivenName] = useState('');
  const [userFamilyName, setUserFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [webId, setWebId] = useState('');
  const { addUser } = useContext(UserListContext);

  const wrappedSetUsername = (value) => {
    setUsername(value);
    const renderedWebId = renderWebId(value);
    setWebId(renderedWebId);
  };

  const submitUser = async (userObject) => {
    const user = await createUser(userObject);
    await addUser(user);
  };

  const notifyStartSubmission = (userObject) => {
    // ===== START OF ERROR DISPLAY OPTIONS =====
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
    // ===== END OF ERROR DISPLAY OPTIONS =====

    dispatch({ type: 'SET_PROCESSING' });

    runNotification(
      `Adding "${userObject.givenName} ${userObject.familyName}" to client list...`,
      5,
      state,
      dispatch
    );
  };

  // Event handler for adding client to users list
  const handleAddClient = async (event) => {
    event.preventDefault();
    const userObject = {
      givenName: event.target.addUserGivenName.value,
      familyName: event.target.addUserFamilyName.value,
      username: event.target.addUsername.value,
      webId: event.target.addWebId.value
    };

    notifyStartSubmission(userObject, state, dispatch);
    try {
      await submitUser(userObject);
    } finally {
      runNotification(
        `"${userObject.givenName} ${userObject.familyName}" added to client list`,
        5,
        state,
        dispatch
      );
      addNotification('success', `this is a test`);
      setTimeout(() => {
        setUserGivenName('');
        setUserFamilyName('');
        setUsername('');
        setWebId('');
        dispatch({ type: 'CLEAR_PROCESSING' });
        setShowAddClientModal(false);
      }, 2000);
    }
  };

  return (
    <Dialog
      open={showAddClientModal}
      aria-labelledby="dialog-title"
      onClose={() => setShowAddClientModal(false)}
    >
      <FormSection
        title="Add Client"
        state={state}
        statusType="Status"
        defaultMessage="To be added..."
      >
        <form onSubmit={handleAddClient} autoComplete="off">
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
              onClick={() => setShowAddClientModal(false)}
              fullWidth
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<CheckIcon />}
              // TODO: Determine what to do with modals after submitting.
              // e.g. should it close automatically but have a pop-up status alert, remain open briefly, etc.
              // onClick={() => setShowModal(false)}
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

export default AddClientModal;
