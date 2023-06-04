// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// Context Imports
import { UserListContext } from '../../contexts';
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
  const { userList } = useContext(UserListContext);

  return (
    userList.length ? (
      // render if clients
      <ClientListTable
        loadingActive={loadingActive}
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
