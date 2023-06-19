// React Imports
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
// Material UI Imports
import { Container } from '@mui/system';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Component Imports
import {
  UploadDocumentForm,
  SetAclPermissionForm,
  SetAclPermsDocContainerForm,
  CheckAclPermsDocContainerForm
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

  const { selectedUser } = useContext(SelectedUserContext);
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
      {
        podUrl === selectedUser.podUrl ?
          <Typography>Personal Pod</Typography> :
          <Typography>Client selected: {selectedUser.person || selectedUser.podUrl}</Typography>
      }
      
      <UploadDocumentForm />
      <Container>
        <DocumentTable />
      </Container>
      <SetAclPermsDocContainerForm />
      <CheckAclPermsDocContainerForm />
      <SetAclPermissionForm />
    </Box>
  );
};

export default Forms;
