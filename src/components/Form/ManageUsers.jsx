import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { useStatusNotification, useField } from '../../hooks';
import { runNotification, addUserToPod } from '../../utils';
import FormSection from './FormSection';
import { UserListContext /* , SelectUserContext */ } from '../../contexts';

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
  const { clearValue: clearUserName, ...userName } = useField('text');
  const { clearValue: clearUserUrl, ...userUrl } = useField('text');
  // const { setSelectedUser } = useContext(SelectUserContext);
  const { setUserList } = useContext(UserListContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      name: event.target.addUserName.value,
      url: event.target.addUserUrl.value
    };

    if (!userObject.url) {
      runNotification(`Operation failed. Reason: No URL provided`, 3, state, dispatch);
      return;
    }

    if (!userObject.name) {
      runNotification(`Operation failed. Reason: User's name is not provided`, 3, state, dispatch);
      return;
    }

    const listUsers = await addUserToPod(session, userObject);
    setUserList(listUsers);

    runNotification(`Adding user "${userObject.name}" to Solid...`, 3, state, dispatch);

    setTimeout(() => {
      dispatch({ type: 'CLEAR_PROCESSING' });
      clearUserName();
      clearUserUrl();
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
          <label htmlFor="add-user-name">User's name (i.e. John Doe): </label>
          <input id="add-user-name" name="addUserName" {...userName} />{' '}
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
