// React Imports
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
// Material UI Imports
import { Container } from '@mui/system';
import Button from '@mui/material/Button';
import Remove from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Component Imports
import {
  UploadDocumentForm,
  SetAclPermissionForm,
  SetAclPermsDocContainerForm
} from '../components/Form';
import { SelectedUserContext, SignedInUserContext } from '../contexts';
import DocumentTable from '../components/Documents/DocumentTable';

/**
 * Forms Page - Component that generates Forms Page for PASS
 *
 * @memberof Pages
 * @name Forms
 */

const Forms = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const { selectedUser, selectUser } = useContext(SelectedUserContext);
  const { podUrl } = useContext(SignedInUserContext);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        size="small"
        aria-label="Clear Client Button"
        startIcon={<Remove />}
        onClick={() => selectUser()}
        sx={{ margin: '2rem 0 1rem' }}
      >
        Clear Client
      </Button>
      {podUrl === selectedUser.podUrl ? (
        <Typography>Personal Pod</Typography>
      ) : (
        <Typography>Client selected: {selectedUser.person || selectedUser.podUrl}</Typography>
      )}

      <UploadDocumentForm />
      <Container>
        <DocumentTable />
      </Container>
      <SetAclPermsDocContainerForm />
      <SetAclPermissionForm />
    </Box>
  );
};

export default Forms;
