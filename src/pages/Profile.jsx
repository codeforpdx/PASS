// React Imports
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ShieldIcon from '@mui/icons-material/Shield';
import Typography from '@mui/material/Typography';
// Model Imports
import { fetchProfileInfo } from '../model-helpers';
// Component Inputs
import { UploadDocumentModal, SetAclPermissionsModal } from '../components/Modals';
import { DocumentTable } from '../components/Documents';
import { ProfileComponent } from '../components/Profile';
import { LoadingAnimation } from '../components/Notification';

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
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAclPermissionModal, setShowAclPermissionModal] = useState(false);
  const [dataset, setDataset] = useState({
    modalType: '',
    documentName: ''
  });

  // Profile related states
  const client = location.state?.client;
  const [clientProfile, setClientProfile] = useState(null);
  const webIdUrl = client?.webId ?? session.info.webId;
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Handler for the SetAclPermissions Modal that
  // sets the appropriate version of the modal to load,
  // and the file name for the relevant document, (if any)
  // before opening the modal.

  const handleModal = (type, fileName = '') => {
    setDataset({
      documentName: fileName,
      modalType: type
    });
    setShowAclPermissionModal(true);
  };

  useEffect(() => {
    const fetchClientProfile = async () => {
      const profileData = await fetchProfileInfo(webIdUrl);
      setClientProfile({ ...client, ...profileData.profileInfo });
    };

    if (client) {
      fetchClientProfile();
    } else {
      setClientProfile(null);
    }
  }, [client]);

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
        <Typography>
          User WebId:{' '}
          <Link to={webIdUrl} target="_blank" rel="noreferrer">
            {webIdUrl}
          </Link>
        </Typography>

        <ProfileComponent clientProfile={clientProfile} />

        <Container sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!client && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              aria-label="Set Container Permissions Button"
              startIcon={<ShieldIcon />}
              onClick={() => handleModal('container')}
            >
              Set Permission to All Documents
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            aria-label="Add Client Button"
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
        <DocumentTable handleModal={handleModal} />
      </Box>
    </Box>
  );
};

export default Profile;
