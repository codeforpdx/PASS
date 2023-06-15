// React Imports
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Remove from '@mui/icons-material/Remove';
import Typography from '@mui/material/Typography';
// Component Imports
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm,
  SetAclPermsDocContainerForm,
  CheckAclPermsDocContainerForm
} from '../components/Form';
import { SelectUserContext } from '../contexts';

/**
 * Forms Page - Component that generates Forms Page for PASS
 *
 * @memberof Pages
 * @name Forms
 */

const Forms = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {selectedUser.person ? (
        <>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            aria-label="Clear Client Button"
            startIcon={<Remove />}
            onClick={() => setSelectedUser('')}
            sx={{ margin: '2rem 0 1rem' }}
          >
            Clear Client
          </Button>
          <Typography variant="body2">Client selected: {selectedUser.person}</Typography>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            aria-label="Clear Client Button Disabled"
            startIcon={<Remove />}
            sx={{ margin: '2rem 0 1rem' }}
            disabled
          >
            Clear Client
          </Button>
          <Typography variant="body2">No client selected</Typography>
        </>
      )}
      <UploadDocumentForm />
      <FetchDocumentForm />
      <DeleteDocumentForm />
      <SetAclPermsDocContainerForm />
      <CheckAclPermsDocContainerForm />
      <SetAclPermissionForm />
      <CrossPodQueryForm />
      <CrossPodWriteForm />
    </Box>
  );
};

export default Forms;
