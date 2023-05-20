// React Imports
import React, { useContext } from 'react';
import { TextField, Button} from '@mui/material';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import {
  runNotification,
  addUserToPod,
  getUserListActivity
} from '../../utils';

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

const ManageUsers = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUserGivenName, ...userGivenName } = useField('text');
  const { clearValue: clearUserFamilyName, ...userFamilyName } = useField('text');
  const { clearValue: clearUsername, ...username } = useField('text');
  const { clearValue: clearWebId, ...webId } = useField('text');
  const { setUserList } = useContext(UserListContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      givenName: userGivenName.value,
      familyName: userFamilyName.value,
      username: username.value,
      webId: webId.value
    };

    if (!userObject.username && !userObject.webId) {
      runNotification(`Operation failed. Reason: No WebId provided`, 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

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

    setUserList(listUsers);

    setTimeout(() => {
      clearUserFamilyName();
      clearUserGivenName();
      clearUsername();
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 3000);
  };

  const formRowStyle = {
    margin: '20px 0',
  };

  const textFieldStyle = {
    margin: '8px'
  }

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
        <br/>
        <TextField
          style={textFieldStyle}
          id="last-name-form"
          label="Last/Family Name"
          variant="outlined"
          {...userFamilyName}
        />
        <br/>
        <TextField
          style={textFieldStyle}
          id="username-form"
          label="Username"
          variant="outlined"
          {...username}
        />
        <br/>
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
