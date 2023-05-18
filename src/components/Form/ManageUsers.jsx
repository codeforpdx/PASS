// React Imports
import React, { useContext } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// Custom Component Imports
import { useStatusNotification, useField } from '../../hooks';
import {
  runNotification,
  addUserToPod,
  getUserListActivity,
  SOLID_IDENTITY_PROVIDER
} from '../../utils';
import FormSection from './FormSection';
import { UserListContext } from '../../contexts';

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
  const { setUserList } = useContext(UserListContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      givenName: event.target.addUserGivenName.value,
      familyName: event.target.addUserFamilyName.value,
      username: event.target.addUsername.value
    };

    if (!userObject.username) {
      runNotification(`Operation failed. Reason: No username provided`, 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
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

    let listUsers = await addUserToPod(session, userObject);
    listUsers = await getUserListActivity(session, listUsers);

    setUserList(listUsers);

    runNotification(
      `Adding user "${userObject.givenName} ${userObject.familyName}" to Solid...`,
      5,
      state,
      dispatch
    );

    setTimeout(() => {
      clearUserGivenName();
      clearUserFamilyName();
      clearUsername();
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 3000);
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Manage Users"
      state={state}
      statusType="Status"
      defaultMessage="To be added..."
    >
      <form onSubmit={handleAddUser} style={formRowStyle} autoComplete="off">
        <div>
          <label htmlFor="add-user-given-name">First/given name: </label>
          <input id="add-user-given-name" name="addUserGivenName" {...userGivenName} />{' '}
        </div>
        <br />
        <div>
          <label htmlFor="add-user-last-name">Last/family name: </label>
          <input id="add-user-last-name" name="addUserFamilyName" {...userFamilyName} />{' '}
        </div>
        <br />
        <div>
          <label htmlFor="add-username">
            Add username to users list (i.e., username without{' '}
            {SOLID_IDENTITY_PROVIDER.split('/')[2]}):{' '}
          </label>
          <br />
          <br />
          <input id="add-username" name="addUsername" size="60" {...username} />{' '}
        </div>
        <br />
        <button type="submit" disabled={state.processing}>
          Add User
        </button>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default ManageUsers;
