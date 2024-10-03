// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Custom Hooks Imports
import { useNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { ConfirmationModal, UploadDocumentModal, SetAclPermissionsModal } from '@components/Modals';
import { DocumentTable } from '@components/Documents';
import { LoadingAnimation } from '@components/Notification';
// Util Imports
import { truncateText } from '@utils';
// Model Helpers
// import { fetchProfileInfo } from '../model-helpers';

/**
 * Documents Page - Page that displays the user's document information and
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

  // Documents related states
  const contact = location.state?.contact;
  const [loadingDocuments, setLoadingDocuments] = useState(true);

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
    }, 1000);
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
          width: isSmallScreen ? '100%' : 'auto'
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          My Documents
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'row',
            paddingLeft: '0px'
          }}
        >
          {!contact && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleAclPermissionsModal('container')}
              sx={{
                width: isSmallScreen ? '165px' : '200px',
                borderColor: 'primary.main',
                padding: '6px 12px'
              }}
            >
              Share Documents
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setShowAddDocModal(true)}
            sx={{ width: isSmallScreen ? '140px' : '180px', padding: '6px 12px' }}
          >
            Add Document
          </Button>
        </Box>
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
      </Box>
      <DocumentTable
        handleAclPermissionsModal={handleAclPermissionsModal}
        handleSelectDeleteDoc={(document) => handleSelectDeleteDoc(document)}
      />
    </Container>
  );
};

export default Documents;
