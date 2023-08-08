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
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
// Model Imports
import { fetchProfileInfo } from '../model-helpers';
// Component Inputs
import {
  UploadDocumentModal,
  SetAclPermissionModal,
  SetAclPermsDocContainerModal
} from '../components/Modals';
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
  const [showAclPermsDocContainerModal, setShowAclPermsDocContainerModal] = useState(false);
  const [showAclPermissionModal, setShowAclPermissionModal] = useState(false);
  const [documentName, setDocumentName] = useState('filename.jpg');

  // Profile related states
  const client = location.state?.client;
  const [clientProfile, setClientProfile] = useState(null);
  const webIdUrl = client?.webId ?? session.info.webId;
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Function for the "Permission" buttons in each document
  // table row that opens the Document Permissions Modal
  // and sets the File Name to that of the corresponding
  // file in the table.
  const handlePermissions = (fileName) => {
    setDocumentName(fileName);
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

        {!client && (
          <>
            <Container sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                aria-label="Set Container Permissions Button"
                startIcon={<SettingsIcon />}
                onClick={() => setShowAclPermsDocContainerModal(true)}
              >
                Container Permissions
              </Button>
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
            <SetAclPermsDocContainerModal
              showModal={showAclPermsDocContainerModal}
              setShowModal={setShowAclPermsDocContainerModal}
            />
            <SetAclPermissionModal
              showModal={showAclPermissionModal}
              setShowModal={setShowAclPermissionModal}
              documentName={documentName}
            />
          </>
        )}
        <UploadDocumentModal showModal={showAddDocModal} setShowModal={setShowAddDocModal} />
        <DocumentTable handlePermissions={handlePermissions} />
      </Box>
    </Box>
  );
};

export default Profile;
