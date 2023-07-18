// React Imports
import React, { useContext, useState } from 'react';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Remove from '@mui/icons-material/Remove';
import Typography from '@mui/material/Typography';
// Component Imports
import { SetAclPermissionForm, SetAclPermsDocContainerForm } from '../components/Form';
import UploadDocumentModal from '../components/Modals/UploadDocumentModal';
import { SelectedUserContext, SignedInUserContext } from '../contexts';
import DocumentTable from '../components/Documents/DocumentTable';

/**
 * Documents Page - Component that generates Documents Page for PASS
 *
 * @memberof Pages
 * @name Documents
 * @returns {React.JSX.Element} The Documents Page
 */
const Documents = () => {
  // state for UploadDocumentModal component
  const [showModal, setShowModal] = useState(false);
  localStorage.setItem('restorePath', '/documents');

  const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);
  const { podUrl } = useContext(SignedInUserContext);

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
        size="small"
        aria-label="Clear Client Button"
        startIcon={<Remove />}
        onClick={() => setSelectedUser()}
        sx={{ margin: '1rem 0' }}
      >
        Clear Client
      </Button>
      {podUrl === selectedUser.podUrl ? (
        <Typography>Personal Pod</Typography>
      ) : (
        <Typography>Client selected: {selectedUser.person || selectedUser.podUrl}</Typography>
      )}

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

export default Documents;
