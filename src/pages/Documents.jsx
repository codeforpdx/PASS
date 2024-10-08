// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Custom Hooks Imports
import { useNotification } from '@hooks';
// Material UI Imports
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { ConfirmationModal, SetAclPermissionsModal, UploadDocumentModal } from '@components/Modals';
import { DocumentTable } from '@components/Documents';
import { LoadingAnimation } from '@components/Notification';
// Util Imports
import { truncateText } from '@utils';

/**
 * Documents Page - Page that displays the user's documents and
 * allow users to edit/update them on PASS
 *
 * @memberof Pages
 * @name Documents
 * @returns {React.JSX.Element} The Documents Page
 */
const Documents = () => {
  // Route related states
  const location = useLocation();
  if (location.pathname.split('/')[1] === 'contacts') {
    localStorage.setItem('restorePath', '/contacts');
  } else {
    localStorage.setItem('restorePath', '/documents');
  }
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Documents related states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { addNotification } = useNotification();
  const { removeDocument } = useContext(DocumentListContext);
  const [selectedDocToDelete, setSelectedDocToDelete] = useState(null);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAclPermissionModal, setShowAclPermissionModal] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [dataset, setDataset] = useState({
    modalType: '',
    docName: '',
    docType: ''
  });

  const handleSelectDeleteDoc = (document) => {
    setSelectedDocToDelete(document);
    setShowConfirmationModal(true);
  };

  // Function for deleting documents
  const handleDeleteDoc = async () => {
    setProcessing(true);
    try {
      await removeDocument(selectedDocToDelete.name);
      addNotification('success', `${selectedDocToDelete?.name} deleted from the pod.`);
    } catch (e) {
      addNotification('error', `Document deletion failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  // Contacts related states
  const contact = location.state?.contact;

  // Handler for the SetAclPermissions Modal that
  // sets the appropriate version of the modal to load,
  // and the file name for the relevant document, (if any)
  // before opening the modal.
  const handleAclPermissionsModal = (modalType, docName = '', docType = '') => {
    setDataset({
      modalType,
      docName,
      docType
    });
    setShowAclPermissionModal(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadingDocuments(false);
    }, 500);
  }, []);

  const truncatedText = selectedDocToDelete?.name ? truncateText(selectedDocToDelete.name) : '';

  if (loadingDocuments) {
    return (
      <LoadingAnimation loadingItem="Documents">
        <CircularProgress />
      </LoadingAnimation>
    );
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
          width: isSmallScreen ? '100%' : 'auto',
          padding: '20px'
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          My Documents
        </Typography>
        <Stack direction="row" spacing={2}>
          <>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleAclPermissionsModal('container')}
              sx={{
                // width: isSmallScreen ? '165px' : '200px',
                borderColor: 'primary.main',
                padding: '6px 12px'
              }}
              disabled={contact}
            >
              Share Documents
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setShowAddDocModal(true)}
              sx={{
                // width: isSmallScreen ? '140px' : '180px',
                padding: '6px 12px'
              }}
            >
              Add Document
            </Button>
          </>
        </Stack>
        <UploadDocumentModal showModal={showAddDocModal} setShowModal={setShowAddDocModal} />
        <SetAclPermissionsModal
          showModal={showAclPermissionModal}
          setShowModal={setShowAclPermissionModal}
          dataset={dataset}
        />
        <ConfirmationModal
          showModal={showConfirmationModal}
          setShowModal={setShowConfirmationModal}
          title="Delete Document"
          text={`You're about to delete "${truncatedText}" from the pod. Do you wish to continue?`}
          onConfirm={handleDeleteDoc}
          confirmButtonText="Delete"
          processing={processing}
        />
      </Card>
      <DocumentTable
        handleAclPermissionsModal={handleAclPermissionsModal}
        handleSelectDeleteDoc={(document) => handleSelectDeleteDoc(document)}
      />
    </Container>
  );
};

export default Documents;
