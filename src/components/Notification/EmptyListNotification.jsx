// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/**
 * EmptyListNotification Component - Component
 * that displays a message to the user letting
 * them know their data list is empty, and thus
 * nothing is being rendered.
 *
 * @memberof Notification
 * @name EmptyListNotification
 */

const EmptyListNotification = ({ type }) => {
  const str1 = `No ${type} found.`;
  const str2 = type === 'clients' ? 'Added' : 'Uploaded';
  const str3 = `${str2} ${type} will be listed here.`;

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ my: '3rem' }}>
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <Typography variant="h6" component="h2" mb={2} align="center" color="secondary">
            {str1}
            <br />
            {str3}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmptyListNotification;
