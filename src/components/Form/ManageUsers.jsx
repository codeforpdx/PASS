import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { useStatusNotification, useField } from '../../hooks';
import { runNotification, addUserToPod, getUserListActivity } from '../../utils';
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
  const { clearValue: clearUserUrl, ...userUrl } = useField('text');
  const { setUserList } = useContext(UserListContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      givenName: event.target.addUserGivenName.value,
      familyName: event.target.addUserFamilyName.value,
      url: event.target.addUserUrl.value
    };

    if (!userObject.url) {
      runNotification(`Operation failed. Reason: No URL provided`, 5, state, dispatch);
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
      clearUserUrl();
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 3000);
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Manage Users"
      state={state}
      statusType="Status"
      defaultMessage="To be added..."
    >
      <form onSubmit={handleAddUser} style={formRowStyle} autoComplete="off">
        <div>
          <label htmlFor="add-user-given-name">User's first/given name: </label>
          <input id="add-user-given-name" name="addUserGivenName" {...userGivenName} />{' '}
        </div>
        <br />
        <div>
          <label htmlFor="add-user-last-name">User's last/family name: </label>
          <input id="add-user-last-name" name="addUserFamilyName" {...userFamilyName} />{' '}
        </div>
        <br />
        <div>
          <label htmlFor="add-user-url">
            Add Pod URL to users list (i.e., username.opencommons.net):{' '}
          </label>
          <br />
          <br />
          <input id="add-user-url" name="addUserUrl" size="60" {...userUrl} />{' '}
        </div>
        <br />
        <button type="submit" disabled={state.processing}>
          Add User
        </button>
      </form>
    </FormSection>
  );
};

export default ManageUsers;
