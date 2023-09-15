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
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { ConfirmationModal, UploadDocumentModal, SetAclPermissionsModal } from '@components/Modals';
import { DocumentTable } from '@components/Documents';
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
  localStorage.setItem('restorePath', '/profile');

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
      const profileData = await fetchProfileInfo(session, webIdUrl);
      setContactProfile({
        ...contact,
        ...profileData.profileInfo,
        ...profileData.privateProfileInfo
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '30px'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Profile Information</Typography>
        {!contact ? (
          <Typography>
            <a href={signupLink} rel="noopener noreferrer" target="_blank">
              Your Signup Link
            </a>
          </Typography>
        ) : null}
        <Typography>
          User WebId:
          <Link to={webIdUrl} target="_blank" rel="noreferrer">
            {webIdUrl}
          </Link>
        </Typography>

        <ProfileComponent contactProfile={contactProfile} />

        <Container sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!contact && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              aria-label="Share Documents Folder Button"
              startIcon={<ShareIcon />}
              onClick={() => handleAclPermissionsModal('container')}
            >
              Share Documents Folder
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            aria-label="Add Document Button"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDocModal(true)}
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
        <DocumentTable
          handleAclPermissionsModal={handleAclPermissionsModal}
          handleSelectDeleteDoc={(document) => handleSelectDeleteDoc(document)}
        />
        <ConfirmationModal
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
          title="Delete Document?"
          text={`You're about to delete "${selectedDocToDelete?.name}" from the pod, do you wish to continue?`}
          confirmButtonFunction={handleDeleteDoc}
          confirmButtonText="Delete Document"
          processing={processing}
        />
      </Box>
    </Box>
  );
};

export default Profile;
