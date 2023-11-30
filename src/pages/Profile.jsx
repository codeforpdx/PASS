// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Custom Hook Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ShareIcon from '@mui/icons-material/Share';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { ConfirmationModal, UploadDocumentModal, SetAclPermissionsModal } from '@components/Modals';
import DocumentTable from '@components/Documents';
import { ProfileComponent } from '@components/Profile';
import { LoadingAnimation } from '@components/Notification';
// Model Helpers
import { fetchProfileInfo } from '../model-helpers';

/**
 * Profile Page - Page that displays the user's profile card information and
 * allow users to edit/update them on PASS
 *
 * @memberof Pages
 * @name Profile
 * @returns {React.JSX.Element} The Profile Page
 */
const Profile = () => {
  // Route related states
  const location = useLocation();
  if (location.pathname.split('/')[1] === 'contacts') {
    localStorage.setItem('restorePath', '/contacts');
  } else {
    localStorage.setItem('restorePath', '/profile');
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

  // Profile related states
  const contact = location.state?.contact;
  const [contactProfile, setContactProfile] = useState(null);
  const webIdUrl = contact?.webId ?? session.info.webId;
  const [loadingProfile, setLoadingProfile] = useState(true);

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
    const fetchContactProfile = async () => {
      const profileData = await fetchProfileInfo(webIdUrl);
      setContactProfile({
        ...contact,
        ...profileData.profileInfo
      });
    };

    if (contact) {
      fetchContactProfile();
    } else {
      setContactProfile(null);
    }
  }, [contact]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingProfile(false);
    }, 1000);
  }, []);

  if (loadingProfile) {
    return (
      <LoadingAnimation loadingItem="Profile">
        <CircularProgress />
      </LoadingAnimation>
    );
  }

  const signupLink = `${window.location.origin}/signup?webId=${encodeURIComponent(
    session.info.webId
  )}`;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Profile Information</Typography>
        {!contact ? (
          <Typography>
            <a href={signupLink} rel="noopener noreferrer" target="_blank">
              Your Signup Link
            </a>
          </Typography>
        ) : null}
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: isSmallScreen ? 'column' : 'row'
          }}
        >
          <Typography>User WebId: </Typography>
          <Link
            to={webIdUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              maxWidth: isSmallScreen ? '240px' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {webIdUrl}
          </Link>
        </Box>

        <ProfileComponent contactProfile={contactProfile} />

        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexDirection: isSmallScreen ? 'column' : 'row'
          }}
        >
          {!contact && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ShareIcon />}
              onClick={() => handleAclPermissionsModal('container')}
              sx={{ width: isSmallScreen ? '250px' : 'default' }}
            >
              Share Documents Folder
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDocModal(true)}
            sx={{ width: isSmallScreen ? '200px' : 'default' }}
          >
            Add Document
          </Button>
        </Container>
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

export default Profile;
