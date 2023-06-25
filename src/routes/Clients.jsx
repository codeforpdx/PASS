// React Imports
import React, { useContext } from 'react';
// React Router Imports
import { useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Component Imports
import ClientList from '../components/Clients/ClientList';
import { SignedInUserContext, UserListContext } from '../contexts';

/**
 * Clients Component - Component that generates Clients Page for PASS
 *
 * @memberof Pages
 * @name Clients
 */

const Clients = () => {
  // state for AddClientModal component

  const { loadingUsers } = useContext(UserListContext);
  const { podUrl } = useContext(SignedInUserContext);

  const location = useLocation();
  localStorage.setItem('restorePath', location.pathname);

  return loadingUsers ? (
    <Container>
      <Box
        sx={{
          marginTop: 18,
          marginBottom: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <Typography variant="h5" component="h2" mb={2} align="center">
            Loading clients...
          </Typography>
          <LinearProgress />
        </Paper>
      </Box>
    </Container>
  ) : (
    <Container>
      <p>Your Client Registration Link:</p>
      <a href={`${window.location.origin}/PASS/#/PASS/Signup?podUrl=${podUrl}`}>
        {window.location.origin}/PASS/#/PASS/Signup?podUrl={podUrl}
      </a>
      <ClientList />
    </Container>
  );
};

export default Clients;
