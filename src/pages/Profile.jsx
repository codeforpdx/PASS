// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@hooks';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// Component Inputs
import { SetAclPermissionForm, SetAclPermsDocContainerForm } from '../components/Form';
import { UploadDocumentModal } from '../components/Modals';
import { DocumentTable } from '../components/Documents';
import UserProfile from '../components/Profile/UserProfile';
import ClientProfile from '../components/Profile/ClientProfile';
import { fetchProfileInfo } from '../model-helpers';
import { LoadingAnimation } from '../components/Notification';
import { SelectedUserContext } from '../contexts';

/**
 * @typedef {import("../typedefs.js").profilePageProps} profilePageProps
 */

/**
 * Profile Page - Page that displays the user's profile card information and
 * allow users to edit/update them on PASS
 *
 * @memberof Pages
 * @name Profile
 * @param {profilePageProps} Props - Props for Profile Page
 * @returns {React.JSX.Element} The Profile Page
 */
const Profile = ({ user }) => {
  const location = useLocation();
  const client = location.state?.client;
  const [clientProfile, setClientProfile] = useState(null);
  const { session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const webIdUrl = user === 'personal' ? session.info.webId : client?.webId;
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { setSelectedUser } = useContext(SelectedUserContext);

  localStorage.setItem('restorePath', user === 'personal' ? '/profile' : '/clients');

  useEffect(() => {
    const fetchClientProfile = async () => {
      const profileData = await fetchProfileInfo(session, client.webId);
      setClientProfile({ ...client, ...profileData.profileInfo });
    };

    if (client) fetchClientProfile();
  }, [client]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingProfile(false);
    }, 1000);
  }, []);

  if (loadingProfile) {
    return <LoadingAnimation loadingItem="Profile" animationType="circular" />;
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

        {/* TODO: Refactor/optimize the form below once we have more input */}
        {/* fields to update profile for */}
        {user === 'personal' ? (
          <UserProfile />
        ) : (
          <ClientProfile clientProfile={clientProfile} setSelectedUser={setSelectedUser} />
        )}
        <Button
          variant="contained"
          color="secondary"
          size="small"
          aria-label="Add Client Button"
          startIcon={<AddIcon />}
          onClick={() => setShowModal(true)}
        >
          Add Document
        </Button>
        <UploadDocumentModal
          showModal={showModal}
          setShowModal={setShowModal}
          user={user}
          client={client}
        />
        <DocumentTable user={user} client={client} />
        <SetAclPermsDocContainerForm user={user} />
        <SetAclPermissionForm user={user} />
      </Box>
    </Box>
  );
};

export default Profile;
