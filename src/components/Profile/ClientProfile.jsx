import React from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/**
 * @typedef {import("../../typedefs.js").clientProfileProps} clientProfileProps
 */

/**
 * The ClientProfile Component used to generate the profile card for the client
 *
 * @memberof Profile
 * @name ClientProfile
 * @param {clientProfileProps} Props - Props for ClientProfile component
 * @returns {React.JSX.Element} The ClientProfile Component
 */
const ClientProfile = ({ selectedUser, setSelectedUser }) => (
  <>
    <Link to="/clients" style={{ textDecoration: 'none', color: 'white' }}>
      <Button
        variant="contained"
        color="secondary"
        aria-label="Back Button"
        startIcon={<BackspaceIcon />}
        onClick={() => setSelectedUser()}
      >
        Go Back
      </Button>
    </Link>
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
  </>
);

export default ClientProfile;
