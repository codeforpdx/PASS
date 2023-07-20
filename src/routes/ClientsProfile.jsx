// React Imports
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Component Imports
import { SetAclPermissionForm, SetAclPermsDocContainerForm } from '../components/Form';
import UploadDocumentModal from '../components/Modals/UploadDocumentModal';
import { SelectedUserContext, SignedInUserContext } from '../contexts';
import DocumentTable from '../components/Documents/DocumentTable';

const ClientsProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const { selectedUser } = useContext(SelectedUserContext);
  const { podUrl } = useContext(SignedInUserContext);

  const location = useLocation();
  localStorage.setItem('restorePath', location.pathname);

  console.log(selectedUser);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '30px'
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        aria-label="Back Button"
        startIcon={<BackspaceIcon />}
        sx={{ margin: '1rem 0' }}
      >
        <Link to="/PASS/clients" style={{ textDecoration: 'none', color: 'white' }}>
          Go Back
        </Link>
      </Button>
      {podUrl === selectedUser.podUrl ? (
        <Typography>Personal Pod</Typography>
      ) : (
        <Typography>Client selected: {selectedUser.person || selectedUser.podUrl}</Typography>
      )}

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

      <Button
        variant="contained"
        color="secondary"
        size="small"
        aria-label="Add Client Button"
        startIcon={<AddIcon />}
        onClick={() => setShowModal(true)}
        sx={{ marginTop: '3rem' }}
      >
        Add Document
      </Button>
      {/* modal/popup renders when setShowModal state is true */}
      <UploadDocumentModal showModal={showModal} setShowModal={setShowModal} />
      <DocumentTable />
      <SetAclPermsDocContainerForm />
      <SetAclPermissionForm />
    </Box>
  );
};

export default ClientsProfile;
