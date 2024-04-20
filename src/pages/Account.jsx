// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Custom Hook Imports
import { useNotification, useSession } from '@hooks';
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
import DocumentTable from '@components/Documents';
import { AccountComponent } from '@components/Account';
import { LoadingAnimation } from '@components/Notification';
// Model Helpers
import { fetchAccountInfo } from '../model-helpers';

/**
 * Account Page - Page that displays the user's profile card information and
 * allow users to edit/update them on PASS
 *
 * @memberof Pages
 * @name Account
 * @returns {React.JSX.Element} The Account Page
 */
const Account = () => {
  // Route related states
  const location = useLocation();
  if (location.pathname.split('/')[1] === 'contacts') {
    localStorage.setItem('restorePath', '/contacts');
  } else {
    localStorage.setItem('restorePath', '/account');
  }
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Documents related states
  const { session } = useSession();
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

  // Account related states
  const contact = location.state?.contact;
  const [contactAccount, setContactAccount] = useState(null);
  const webIdUrl = contact?.webId ?? session.info.webId;
  const [loadingAccount, setLoadingAccount] = useState(true);

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
    const fetchContactAccount = async () => {
      const accountData = await fetchAccountInfo(webIdUrl);
      setContactAccount({
        ...contact,
        ...accountData.accountInfo
      });
    };

    if (contact) {
      fetchContactAccount();
    } else {
      setContactAccount(null);
    }
  }, [contact]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingAccount(false);
    }, 1000);
  }, []);

  if (loadingAccount) {
    return (
      <LoadingAnimation loadingItem="Account">
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>My Account</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            flexDirection: isSmallScreen ? 'column' : 'row'
          }}
        />

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
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleAclPermissionsModal('container')}
              sx={{ width: isSmallScreen ? '165px' : '200px' }}
            >
              Share Documents
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setShowAddDocModal(true)}
            sx={{ width: isSmallScreen ? '140px' : '180px' }}
          >
            Add Document
          </Button>
        </Box>
        <AccountComponent contactAccount={contactAccount} webId={webIdUrl} />
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
          text={`You're about to delete "${selectedDocToDelete?.name}" from the pod, do you wish to continue?`}
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

export default Account;
