import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useStatusNotification } from '../../hooks';
import { runNotification, deleteUserFromPod } from '../../utils';
import FormSection from '../Form/FormSection';
import { SelectUserContext, UserListContext } from '../../contexts';

/**
 * UsersList Component - Component that generates UsersList section for PASS
 * which interfaces with Solid Pod to fetch user list
 *
 * @memberof Users
 * @name UsersList
 */

const UsersList = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { setSelectedUser } = useContext(SelectUserContext);
  const { userList, setUserList } = useContext(UserListContext);

  // Event handler for selecting user from users list
  const handleSelectUser = async (userToSelect, selectedUserUrl) => {
    runNotification(`User "${userToSelect}" selected.`, 3, state, dispatch);
    setSelectedUser(selectedUserUrl);
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

  const tableStyle = {
    margin: '20px 0',
    width: '100%',
    textAlign: 'center'
  };

  return (
    <Container component="" maxWidth="">
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '5px',
          width: '95vw'
        }}
      >
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <FormSection
            title="Users List"
            state={state}
            statusType="Status"
            defaultMessage="No actions"
          >
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Pod URL</th>
                  <th>Last Active Date</th>
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
                        <td>{user.dateModified ? user.dateModified.toLocaleDateString() : null}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleSelectUser(user.name, user.url)}
                          >
                            Select
                          </button>
                        </td>
                        <td>
                          <button type="button" onClick={() => handleDeleteUser(user.name)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </FormSection>
        </Paper>
      </Box>
    </Container>
  );
};

export default UsersList;
