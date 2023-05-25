// React Imports
import React, { useContext, useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { getPodUrlAll } from "@inrupt/solid-client";
import { Lock, LockOpen } from '@mui/icons-material';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { runNotification, addUserToPod, getUserListActivity, clearProcessing } from '../../utils';

// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
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

const submitUser = async (userObject, session, podUrl) => {
  let listUsers = await addUserToPod(session, userObject, podUrl);
  listUsers = await getUserListActivity(session, listUsers);
  return listUsers;
};

const notifyStartSubmission = (userObject, state, dispatch) => {

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

}

const notifyEndSubmission = (userObject, state, dispatch) => {

  runNotification(
    `User "${userObject.givenName} ${userObject.familyName}" added to Solid`,
    5,
    state,
    dispatch
  );

  clearProcessing(dispatch);
}

const renderWebId = (username) => {
  const template = ['https://', '.solidcommunity.net/profile/card#me'];
  return `${template[0]}${username}${template[1]}`;
};

const ManageUsers = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [webId, setWebId] = useState('');
  const [userEditingWebId, setUserEditingWebId] = useState(false);
  const { setUserList } = useContext(UserListContext);

  const clearForm = () => {
    setFamilyName('');
    setGivenName('');
    setUsername('');
    setWebId('');
  }

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0]
    podUrl = podUrl || session.info.webId.split("profile")[0];
    const userObject = {
      givenName,
      familyName,
      username,
      webId
    };

    notifyStartSubmission(userObject, state, dispatch)
    try{
      const userList = await submitUser(userObject, session, podUrl);
      setUserList(userList);
    } finally {
      notifyEndSubmission(userObject, state, dispatch);
      clearForm();
    }
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
          aria-label="First Name"
          label="First/Given Name"
          variant="outlined"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="last-name-form"
          aria-label="Family Name"
          label="Last/Family Name"
          variant="outlined"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="username-form"
          label="Username"
          aria-label="Username"
          variant="outlined"
          type="text"
          value={username}
          onChange={(e) => wrappedSetUsername(e.target.value)}
        />
        <br />
        <TextField
          fullWidth
          style={textFieldStyle}
          id="webId"
          label="WebId"
          aria-label="Web ID"
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
            ),
            style: { width: `${webId.length > 40 ? `${webId.length * 9}px` : '300px'}` }
          }}
        />
        <br />
        <Button
          style={textFieldStyle}
          variant="contained"
          aria-label="User Creation Submit"
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
