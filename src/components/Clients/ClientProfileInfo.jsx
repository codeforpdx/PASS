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
      padding: '20px',
      marginTop: '1rem'
    }}
  >
    <Avatar
      src={selectedUser.profileImage}
      alt="PASS profile"
      sx={{ height: '100px', width: '100px', objectFit: 'contain' }}
    />
    <Box>
      <Typography>First/Given Name: {selectedUser.givenName}</Typography>
      <Typography>Last/Family Name: {selectedUser.familyName}</Typography>
    </Box>
  </Paper>
);

export default ClientProfileInfo;
