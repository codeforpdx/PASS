// React Imports
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Custom Hooks Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import { LoadingAnimation } from '@components/Notification';
import { ProfileComponent } from '@components/Profile';
// Model Helpers
import { fetchProfileInfo } from '../model-helpers';

/**
 * Profile Page - Page that displays the user's profile card information and
 * allow users to edit/update it on PASS
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

  // Profile related states
  const contact = location.state?.contact;
  const [contactProfile, setContactProfile] = useState(null);
  const webIdUrl = contact?.webId ?? session.info.webId;
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
        // minHeight: '400px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
          width: isSmallScreen ? '100%' : 'auto',
          pb: '50px'
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          My Profile
        </Typography>
        <ProfileComponent contactProfile={contactProfile} webId={webIdUrl} />
      </Box>
    </Container>
  );
};

export default Profile;
