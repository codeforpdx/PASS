// React Imports
import React, { useContext } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import {Box, Container, Typography} from '@mui/material';
// Utility Imports
import { runNotification, deleteUserFromPod, getUserListActivity } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext, UserListContext } from '../../contexts';
// Component Imports
import FormSection from '../Form/FormSection';


/**
 * ClientList Component - Component that generates ClientList section for PASS
 * which interfaces with Solid Pod to fetch user list
 *
 * @memberof Clients
 * @name ClientList
 */

const ClientList = ({ loadingActive }) => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { setSelectedUser } = useContext(SelectUserContext);
  const { userList, setUserList } = useContext(UserListContext);

  // Event handler for selecting user from users list
  const handleSelectClient = async (clientToSelect, selectedClientUrl) => {
    runNotification(`User "${clientToSelect}" selected.`, 3, state, dispatch);
    setSelectedUser(selectedClientUrl.split('/')[2].split('.')[0]);
  };

  // Event handler for deleting user from users list
  const handleDeleteClient = async (clientToDeleteFullName, clientToDelete, clientToDeleteUrl) => {
    if (
      window.confirm(
        `You're about to delete ${clientToDeleteFullName} from client list, do you wish to continue?`
      )
    ) {
      runNotification(`Deleting ${clientToDeleteFullName} from Solid...`, 3, state, dispatch);
      let listUsers = await deleteUserFromPod(session, clientToDelete, clientToDeleteUrl);
      listUsers = await getUserListActivity(session, listUsers);

      setUserList(listUsers);
    }
  };

  const tableStyle = {
    margin: '20px 0',
    width: '100%',
    textAlign: 'center'
  };

  return (
    <FormSection title="Clients" state={state} statusType="Status" defaultMessage="No actions">
      {userList.length ? (
        // if Clients
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Pod URL</th>
              <th>Last Active Date</th>
              <th>Select User</th>
              <th>Delete User</th>
            </tr>
          </thead>
          <tbody>
            {userList &&
              userList.map((client) => (
                <tr key={client.podUrl}>
                  <td>{client.givenName}</td>
                  <td>{client.familyName}</td>
                  <td>
                    <a href={client.podUrl} target="_blank" rel="noreferrer">
                      {client.podUrl}
                    </a>
                  </td>
                  {loadingActive ? (
                    <td>Loading...</td>
                  ) : (
                    <td>
                      {client.dateModified ? client.dateModified.toLocaleDateString() : 'Not available'}
                    </td>
                  )}
                  <td>
                    <button type="button" onClick={() => handleSelectClient(client.person, client.podUrl)}>
                      select
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDeleteClient(client.person, client.givenName, client.podUrl)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        // if no Clients
        <Container>
          <Box
            sx={{
              marginTop: 3,
              minWidth: 120,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h6' component='h2' mb={2} align='center' color='secondary'>
              Add clients to your list
            </Typography>
          </Box>
        </Container>       
      )}
    </FormSection>
  );
};

export default ClientList;
