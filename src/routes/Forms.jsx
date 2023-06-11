// React Imports
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
// Material UI Imports
import Button from '@mui/material/Button';
import Remove from '@mui/icons-material/Remove';
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
    <div
      style={{
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
        onClick={() => setSelectedUser('')}
        sx={{ margin: '2rem 0 1rem' }}
      >
        Clear Client
      </Button>
      <span>Client selected: {selectedUser || 'No client selected'}</span>
      <UploadDocumentForm />
      <FetchDocumentForm />
      <DeleteDocumentForm />
      <SetAclPermsDocContainerForm />
      <CheckAclPermsDocContainerForm />
      <SetAclPermissionForm />
      <CrossPodQueryForm />
      <CrossPodWriteForm />
    </div>
  );
};

export default Forms;
