import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { runNotification, deleteUserFromPod } from '../../utils';
import { SelectUserContext, UserListContext } from '../../contexts';
import { useStatusNotification } from '../../hooks';
import FormSection from '../Form/FormSection';

const UsersList = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const { userList, setUserList } = useContext(UserListContext);

  // Event handler for deleting user from users list
  const handleSelectUser = async (userToSelect) => {
    runNotification(`User "${userToSelect}" selected.`, 3, state, dispatch);
    setSelectedUser(userToSelect);
  };

  console.log(selectedUser);

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

  const tableStyle = {
    margin: '20px 0',
    width: '100%',
    textAlign: 'center'
  };

  return (
    <FormSection title="Users List" state={state} statusType="Status" defaultMessage="No actions">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Pod URL</th>
            <th>Date Created</th>
            <th>Select User</th>
            <th>Delete User</th>
          </tr>
        </thead>
        <tbody>
          {userList
            ? userList.map((user) => (
                <tr key={user.url}>
                  <td>{user.name}</td>
                  <td>{user.url}</td>
                  <td>{user.dateCreated}</td>
                  <td>
                    <button type="button" onClick={() => handleSelectUser(user.name)}>
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
        </tbody>
      </table>
    </FormSection>
  );
};

export default UsersList;
