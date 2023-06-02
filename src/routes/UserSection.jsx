// React Imports
import React from 'react';
import { useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Component Imports
import { ManageUsers } from '../components/Form';
import UsersList from '../components/Users/UsersList';

/**
 * UserSection Page - Page that generates ManageUser and UserList components for
 * PASS
 *
 * @memberof Pages
 * @name UserSection
 */

const UserSection = ({ loadingUsers, loadingActive }) => {
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
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
              <Typography sx={{ marginBottom: '20px', textAlign: 'center' }}>
                <strong>Users List</strong>
                <br />
                <br />
                Loading users list...
              </Typography>
              <LinearProgress />
            </Paper>
          </Box>
        </Container>
      ) : (
        <UsersList loadingActive={loadingActive} />
      )}
    </>
  );
};

export default UserSection;
