import React, { useContext, useState } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { useStatusNotification, useField } from '../../hooks';
import FormSection from './FormSection';
import { runNotification, addUserToPod, getUsersFromPod, deleteUserFromPod } from '../../utils';
import SelectUserContext from '../../contexts/selectUserContext';

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
  const { clearValue: clearUser, ...user } = useField('text');
  const [userList, setUserList] = useState([]);
  const { setSelectedUser } = useContext(SelectUserContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const otherPodUrl = event.target.addUser.value;

    if (!otherPodUrl) {
      runNotification(`Operation failed. Reason: No URL provided`, 3, state, dispatch);
    } else {
      const listUsers = await addUserToPod(session, otherPodUrl);
      setUserList(listUsers);

      runNotification(`Adding user "${otherPodUrl}" to Solid...`, 3, state, dispatch);

      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
        clearUser();
      }, 3000);
    }
  };

  // Event handler for fetching users list
  const handleGetUser = async () => {
    try {
      const listUsers = await getUsersFromPod(session);
      if (listUsers.length === 0) {
        throw new Error('No users in list');
      }

      runNotification('Getting users list from Solid...', 3, state, dispatch);
      setUserList(listUsers);
    } catch {
      runNotification(`Operation failed. Reason: Users list is empty.`, 3, state, dispatch);
      setUserList([]);
    }
  };

  // Event handler for selecting user from users list
  const handleSelectUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const otherPodUrl = event.target.selectUser.value;

    setSelectedUser(otherPodUrl);
    runNotification(`Selected user "${otherPodUrl}" from users list.`, 3, state, dispatch);

    setTimeout(() => {
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 3000);
  };

  // Event handler for deleting user from users list
  const handleDeleteUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const otherPodUrl = event.target.deleteUser.value;

    try {
      const listUsers = await deleteUserFromPod(session, otherPodUrl);
      if (listUsers.length === 0) {
        throw new Error('No users in list');
      }

      setUserList(listUsers);

      runNotification(`Deleting user "${otherPodUrl}" from Solid...`, 3, state, dispatch);
    } catch {
      runNotification(`Operation failed. Reason: Users list is empty.`, 3, state, dispatch);
      setUserList([]);
    }

    setTimeout(() => {
      dispatch({ type: 'CLEAR_PROCESSING' });
      clearUser();
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
          <label htmlFor="add-user">Type other user's Pod URL to add to user's list: </label>
          <input name="addUser" {...user} /> <button type="submit">Add User</button>
        </div>
      </form>
      <span>Refresh users list from Pod: </span>
      <button type="button" onClick={handleGetUser}>
        Refresh Users
      </button>{' '}
      <br />
      <br />
      <form onSubmit={handleSelectUser}>
        <select name="selectUser">
          {userList.map((userPodUrL) => (
            <option key={userPodUrL}>{userPodUrL}</option>
          ))}
        </select>{' '}
        <button type="submit">Select User</button>
      </form>
      <br />
      <form onSubmit={handleDeleteUser}>
        <select name="deleteUser">
          {userList.map((userPodUrL) => (
            <option key={userPodUrL}>{userPodUrL}</option>
          ))}
        </select>{' '}
        <button type="submit">Delete User</button>
      </form>
    </FormSection>
  );
};

export default ManageUsers;
