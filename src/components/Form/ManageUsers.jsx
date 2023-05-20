// React Imports
import React, { useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import {
  runNotification,
  addUserToPod,
  getUserListActivity,
  SOLID_IDENTITY_PROVIDER
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

    if (!userObject.username || !userObject.webId) {
      runNotification(`Operation failed. Reason: No WebId provided`, 5, state, dispatch);
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
      event.target.reset();
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
          <label htmlFor="add-user-given-name">First/given name:
          <input id="add-user-given-name" name="addUserGivenName" {...userGivenName} />
          </label>
        </div>
        <div>
          <label htmlFor="add-user-last-name">Last/family name: 
          <input id="add-user-last-name" name="addUserFamilyName" {...userFamilyName} />
          </label>
        </div>
        <div>
          <label htmlFor="add-username">
            Add username to users list (i.e., username without
            {SOLID_IDENTITY_PROVIDER.split('/')[2]}):
            <input id="add-username" name="addUsername" size="60" {...username} />
          </label>
        </div>
        <button type="submit" disabled={state.processing}>
          Add User
        </button>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default ManageUsers;
