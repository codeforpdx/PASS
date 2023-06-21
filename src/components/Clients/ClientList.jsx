// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
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

const ClientList = () => {
  const { userListObject } = useContext(UserListContext);

  return userListObject.userList?.length ? (
    // render if clients
    <ClientListTable statusType="Status" defaultMessage="No actions performed" />
  ) : (
    // render if no clients
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <Typography variant="h6" component="h2" mb={2} align="center" color="secondary">
            No clients found.
            <br />
            Added clients will be listed here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ClientList;
