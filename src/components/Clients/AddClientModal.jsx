// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// Utility Imports
import { ENV } from '../../constants';
import { runNotification } from '../../utils';
import { createUser } from '../../model-helpers/User';
// Custom Hook Imports
import { useStatusNotification, useField } from '../../hooks';
// Context Imports
import { UserListContext } from '../../contexts';
// Component Imports
import FormSection from '../Form/FormSection';

/**
 * AddClient Component - Component that allows users to add other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Forms
 * @name AddClient
 */

const renderWebId = (username) => {
  const oidcProvider = ENV.VITE_SOLID_IDENTITY_PROVIDER.split('//')[1];
  const template = ['https://', `.${oidcProvider}profile/card#me`];
  return `${template[0]}${username}${template[1]}`;
};

const AddClientModal = ({ showModal, setShowModal }) => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUserGivenName, ...userGivenName } = useField('text');
  const { clearValue: clearUserFamilyName, ...userFamilyName } = useField('text');
  const [username, setUsername] = useState('');
  const [webId, setWebId] = useState('');
  const { addUser } = useContext(UserListContext);

  const wrappedSetUsername = (value) => {
    setUsername(value);
    const renderedWebId = renderWebId(value);
    setWebId(renderedWebId);
  };

  const submitUser = async (userObject) => {
    const user = await createUser(session, userObject);
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
      }, 3000);
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
      }, 3000);
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
      setTimeout(() => {
        clearUserGivenName();
        clearUserFamilyName();
        setUsername('');
        setWebId('');
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
    }
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <Dialog open={showModal} aria-labelledby="dialog-title" onClose={() => setShowModal(false)}>
      <FormSection
        title="Add Client"
        state={state}
        statusType="Status"
        defaultMessage="To be added..."
      >
        <Box display="flex" justifyContent="center">
          <form
            onSubmit={handleAddClient}
            // style={{ marginTop: '20px', marginBottom: '20px' }}
            autoComplete="off"
          >
            <FormControl fullWidth>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="addUserGivenName"
                    required
                    fullWidth
                    id="add-user-given-name"
                    label="First/given name"
                    autoFocus
                    {...userGivenName}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="add-user-last-name"
                    label="Last/family name"
                    name="addUserFamilyName"
                    autoComplete="family-name"
                    {...userFamilyName}
                  />
                </Grid>
              </Grid>
              <br />
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="add-username"
                  label="username"
                  name="addUsername"
                  autoComplete="username"
                  size="25"
                  value={username}
                  onChange={(e) => wrappedSetUsername(e.target.value)}
                />
              </Grid>
            </FormControl>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="add-webId"
                  // label="webid"
                  name="addWebId"
                  autoComplete="webid"
                  size="25"
                  type="text"
                  value={webId}
                  onChange={(e) => {
                    setWebId(e.target.value);
                  }}
                  placeholder="WebId"
                  readOnly
                  InputProps={{
                    readOnly: true
                  }}
                />
                <Grid container spacing={1}>
                  <Button variant="text" startIcon={<ContentCopyIcon />}>
                    Copy
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            Link copied!
            <br />
            <DialogActions>
              <Button
                variant="outlined"
                color="error"
                endIcon={<ClearIcon />}
                // onClick={() => setShowModal(false)}
              >
                CANCEL
              </Button>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<CheckIcon />}
                // onClick={() => setShowModal(false)}
                // sx={{ marginLeft: '1rem' }}
                type="submit"
                disabled={state.processing}
              >
                ADD CLIENT
              </Button>
            </DialogActions>
          </form>
        </Box>
      </FormSection>
    </Dialog>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default AddClientModal;
