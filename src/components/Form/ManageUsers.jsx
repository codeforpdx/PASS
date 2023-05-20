// React Imports
import React, { useContext, useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { runNotification, addUserToPod, getUserListActivity } from '../../utils';

// Custom Hook Imports
import { useStatusNotification, useField } from '../../hooks';
// Context Imports
import { UserListContext } from '../../contexts';
// Component Imports
import FormSection from './FormSection';

/**
 * ManageUsers Component - Component that allows users to manage other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Forms
 * @name ManageUsers
 */

const WebIdEditButton = ({ lockStatus, setLockStatus }) => (
  <IconButton
    onClick={(e) => {
      e.preventDefault();
      setLockStatus(!lockStatus);
    }}
  >
    {lockStatus ? <LockOpen /> : <Lock />}
  </IconButton>
);

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

const clearProcessing = (dispatch) => {
  setTimeout(() => {
    dispatch({ type: 'CLEAR_PROCESSING' });
  }, 3000);
};

const sendUserToSolid = async (userObject, dispatch, session, state) => {
  if (!userObject.username && !userObject.webId) {
    runNotification(`Operation failed. Reason: No WebId provided`, 5, state, dispatch);
    return;
  }

  dispatch({ type: 'SET_PROCESSING' });

  runNotification(
    `Adding user "${userObject.givenName} ${userObject.familyName}" to Solid...`,
    5,
    state,
    dispatch
  );
  let listUsers = await addUserToPod(session, userObject);
  listUsers = await getUserListActivity(session, listUsers);

  runNotification(
    `User "${userObject.givenName} ${userObject.familyName}" added to Solid`,
    5,
    state,
    dispatch
  );

  clearProcessing(dispatch);

  await listUsers;
};

const renderWebId = (username) => {
  const template = ['https://', '.solidcommunity.net/profile/card#me'];
  return `${template[0]}${username}${template[1]}`;
};

const ManageUsers = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUserGivenName, ...userGivenName } = useField('text');
  const { clearValue: clearUserFamilyName, ...userFamilyName } = useField('text');
  const [username, setUsername] = useState();
  const [webId, setWebId] = useState('');
  const [userEditingWebId, setUserEditingWebId] = useState(false);
  const { setUserList } = useContext(UserListContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    const userObject = {
      givenName: userGivenName.value,
      familyName: userFamilyName.value,
      username,
      webId
    };

    const listUsers = await sendUserToSolid(userObject, dispatch, session, state);

    setUserList(listUsers);
    clearUserFamilyName();
    clearUserGivenName();
    setUsername('');
    setWebId('');
  };

  const wrappedSetUsername = (value) => {
    setUsername(value);
    if (userEditingWebId) {
      return;
    }
    const renderedWebId = renderWebId(value);
    setWebId(renderedWebId);
  };

  return (
    <FormSection
      title="Add New User"
      state={state}
      statusType="Status"
      defaultMessage="To be added..."
    >
      <form onSubmit={handleAddUser} style={formRowStyle} autoComplete="off">
        <TextField
          style={textFieldStyle}
          id="first-name-form"
          label="First/Given Name"
          variant="outlined"
          {...userGivenName}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="last-name-form"
          label="Last/Family Name"
          variant="outlined"
          {...userFamilyName}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="username-form"
          label="Username"
          variant="outlined"
          type="text"
          value={username}
          onChange={(e) => wrappedSetUsername(e.target.value)}
        />
        <TextField
          style={textFieldStyle}
          id="webId"
          label="WebId"
          value={webId}
          onChange={(e) => {
            setWebId(e.target.value);
          }}
          variant="outlined"
          disabled={!userEditingWebId}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <WebIdEditButton
                  lockStatus={userEditingWebId}
                  setLockStatus={setUserEditingWebId}
                />
              </InputAdornment>
            )
          }}
        />
        <br />
        <Button
          style={textFieldStyle}
          variant="contained"
          type="submit"
          disabled={state.processing}
        >
          Add User
        </Button>
      </form>
    </FormSection>
  );
};

export default ManageUsers;
