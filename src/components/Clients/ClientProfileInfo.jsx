// React Imports
import React from 'react';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ClientProfileInfo = ({ selectedUser }) => (
  <Paper
    sx={{
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      padding: '1rem',
      marginTop: '1rem'
    }}
  >
    <Avatar src={selectedUser.profileImage} />
    <Box>
      <Typography>First/Given Name: {selectedUser.givenName}</Typography>
      <Typography>Last/Family Name: {selectedUser.familyName}</Typography>
    </Box>
  </Paper>
);

export default ClientProfileInfo;
