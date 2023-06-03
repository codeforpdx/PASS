// React Imports
import React, { useContext } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// Utility Imports
import { runNotification, deleteUserFromPod, getUserListActivity } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext, UserListContext } from '../../contexts';
// Component Imports
import ClientListTable from './ClientListTable';


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

  // Event handler for selecting client from client list
  const handleSelectClient = async (clientToSelect, selectedClientUrl) => {
    runNotification(`User "${clientToSelect}" selected.`, 3, state, dispatch);
    setSelectedUser(selectedClientUrl.split('/')[2].split('.')[0]);
  };

  // Event handler for deleting client from client list
  const handleDeleteClient = async (clientToDeleteFullName, clientToDelete, clientToDeleteUrl) => {
    if (
      window.confirm(
        `You're about to delete ${clientToDeleteFullName} from client list, do you wish to continue?`
      )
    ) {
      runNotification(`Deleting ${clientToDeleteFullName} from client list...`, 3, state, dispatch);
      let listUsers = await deleteUserFromPod(session, clientToDelete, clientToDeleteUrl);
      listUsers = await getUserListActivity(session, listUsers);

      setUserList(listUsers);
    }
  };

  
  return (
    userList.length ? (
      // render if clients
      <ClientListTable
        userList={userList}
        loadingActive={loadingActive}
        handleSelectClient={handleSelectClient}
        handleDeleteClient={handleDeleteClient}
        state={state}
        statusType="Status"
        defaultMessage="No actions"
      />
    ) : (
      // render if no clients
      <Container>
        <Box
          sx={{
            marginTop: 3,
            minWidth: 120,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h6" component="h2" mb={2} align="center" color="secondary">
            Add clients to your list
          </Typography>
        </Box>
      </Container>
    )
  );
};

export default ClientList;
