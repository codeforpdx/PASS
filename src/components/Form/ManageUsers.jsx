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
  const { clearValue: clearUserName, ...userName } = useField('text');
  const { clearValue: clearUserUrl, ...userUrl } = useField('text');
  const [userList, setUserList] = useState([]);
  const { setSelectedUser } = useContext(SelectUserContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      name: event.target.addUserName.value,
      url: `https://${event.target.addUserUrl.value}`,
      dateCreated: new Date()
    };

    if (!userObject.url) {
      runNotification(`Operation failed. Reason: No URL provided`, 3, state, dispatch);
    } else if (!userObject.name) {
      runNotification(`Operation failed. Reason: User's name is not provided`, 3, state, dispatch);
    } else {
      const listUsers = await addUserToPod(session, userObject);
      setUserList(listUsers);

      runNotification(`Adding user "${userObject.name}" to Solid...`, 3, state, dispatch);

      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
        clearUserName();
        clearUserUrl();
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

  // Event handler for deleting user from users list
  const handleDeleteUser = async (userToDelete) => {
    if (
      window.confirm(
        `You're about to delete user ${userToDelete} from users list, do you wish to continue?`
      )
    ) {
      const listUsers = await deleteUserFromPod(session, userToDelete);

      runNotification(`Deleting user "${userToDelete}" from Solid...`, 3, state, dispatch);
      setUserList(listUsers);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  const tableStyle = {
    width: '100%',
    textAlign: 'center'
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
          <label htmlFor="add-user-name">Type user's name: </label>
          <input id="add-user-name" name="addUserName" {...userName} />{' '}
        </div>
        <br />
        <div>
          <label htmlFor="add-user-url">Type other user's Pod URL to add to user's list: </label>
          <input id="add-user-url" name="addUserUrl" {...userUrl} />{' '}
        </div>
        <br />
        <button type="submit">Add User</button>
      </form>
      <span>Refresh users list from Pod: </span>
      <button type="button" onClick={handleGetUser}>
        Refresh Users
      </button>{' '}
      <br />
      <br />
      <table style={tableStyle}>
        <tr>
          <th>Name</th>
          <th>Pod URL</th>
          <th>Date Created</th>
          <th>Select User</th>
          <th>Delete User</th>
        </tr>
        {userList
          ? userList.map((user) => (
              <tr key={user.url}>
                <td>{user.name}</td>
                <td>{user.url}</td>
                <td>{user.dateCreated}</td>
                <td>
                  <button type="button" onClick={() => console.log(user.name)}>
                    select
                  </button>
                </td>
                <td>
                  <button type="button" onClick={() => handleDeleteUser(user.name)}>
                    delete
                  </button>
                </td>
              </tr>
            ))
          : null}
      </table>
      <br />
    </FormSection>
  );
};

export default ManageUsers;
