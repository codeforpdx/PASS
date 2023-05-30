// React Imports
import React from 'react';
// React Router Imports
import { useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Component Imports
import { ManageUsers } from '../Form';
import ClientList from './ClientList';

/**
 * Clients Component - Component that generates Clients section for PASS
 *
 * @memberof GlobalComponents
 * @name Clients
 */

const Clients = ({ loadingUsers, loadingActive }) => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  return (
    <>
      <ManageUsers />
      {loadingUsers ? (
        <Container>
          <Box
            sx={{
              marginTop: 3,
              minWidth: 120,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
              <Typography variant='h5' component='h2' mb={2} align='center'>
                Loading clients...
              </Typography>
              <LinearProgress />
            </Paper>
          </Box>
        </Container>
      ) : (
        <ClientList loadingActive={loadingActive} />
      )}
    </>
  );
};

export default Clients;
