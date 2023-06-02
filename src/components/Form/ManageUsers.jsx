// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { runNotification, SOLID_IDENTITY_PROVIDER } from '../../utils';
import { createUser } from '../../model-helpers/User';

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

const renderWebId = (username) => {
  const oidcProvider = SOLID_IDENTITY_PROVIDER.split('//')[1];
  const template = ['https://', `.${oidcProvider}profile/card#me`];
  return `${template[0]}${username}${template[1]}`;
};

const ManageUsers = () => {
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

    dispatch({ type: 'SET_PROCESSING' });

    runNotification(
      `Adding user "${userObject.givenName} ${userObject.familyName}" to Solid...`,
      5,
      state,
      dispatch
    );
  };

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
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
        `User "${userObject.givenName} ${userObject.familyName}" added to Solid`,
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

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Add New User"
      state={state}
      statusType="Status"
      defaultMessage="To be added..."
    >
      <form onSubmit={handleAddUser} style={formRowStyle} autoComplete="off">
        <div>
          <label htmlFor="add-user-given-name">
            First/given name:
            <br />
            <input id="add-user-given-name" name="addUserGivenName" {...userGivenName} />
          </label>
        </div>
        <br />
        <div>
          <label htmlFor="add-user-last-name">
            Last/family name:
            <br />
            <input id="add-user-last-name" name="addUserFamilyName" {...userFamilyName} />
          </label>
        </div>
        <br />
        <div>
          <label htmlFor="add-username">
            Username:
            <br />
            <input
              id="add-username"
              name="addUsername"
              size="25"
              type="text"
              value={username}
              onChange={(e) => wrappedSetUsername(e.target.value)}
            />
          </label>
        </div>
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
        <button type="submit" disabled={state.processing}>
          Add User
        </button>
      </form>
    </FormSection>
  );
};

export default ManageUsers;
