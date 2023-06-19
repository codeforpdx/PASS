// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
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
            {/* <DialogTitle id="dialog-tile">Add Client</DialogTitle> */}
            <FormControl fullWidth>
              <DialogContent>Upload document to username:</DialogContent>
              <div>
                <InputLabel htmlFor="add-user-given-name">First/given name: </InputLabel>
                <input id="add-user-given-name" name="addUserGivenName" {...userGivenName} />
              </div>
              <br />
              <div>
                <label htmlFor="add-user-last-name">Last/family name: </label>
                <input id="add-user-last-name" name="addUserFamilyName" {...userFamilyName} />
              </div>
              <br />
              <div>
                <label htmlFor="add-username">username:</label>
                <br />
                <br />
                <input
                  id="add-username"
                  name="addUsername"
                  size="25"
                  value={username}
                  onChange={(e) => wrappedSetUsername(e.target.value)}
                />
              </div>
            </FormControl>
            <br />
            <label htmlFor="add-webId">
              WebId:
              <br />
              <input
                id="add-webId"
                name="addWebId"
                size="25"
                type="text"
                value={webId}
                onChange={(e) => {
                  setWebId(e.target.value);
                }}
              />
            </label>
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
                color="success"
                endIcon={<CheckIcon />}
                // onClick={() => setShowModal(false)}
                sx={{ marginLeft: '1rem' }}
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
