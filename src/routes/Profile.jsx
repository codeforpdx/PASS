// React Imports
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// Utility Imports
import { fetchProfileInfo } from '../utils';
// Component Inputs
import ProfileInputField from '../components/Profile/ProfileInputField';

/**
 * Profile Page - Page that displays the user's profile card information and
 * allow users to edit/update them on PASS
 *
 * @memberof Pages
 * @name Profile
 * @returns {React.JSX.Element} The Profile Page
 */
const Profile = () => {
  const location = useLocation();
  const { session } = useSession();

  localStorage.setItem('restorePath', location.pathname);

  const [profileName, setProfileName] = useState(null);
  const [organization, setOrganization] = useState(null);

  const fetchProfileData = async () => {
    const profileObject = await fetchProfileInfo(session);

    setProfileName(profileObject.profileInfo.profileName);
    setOrganization(profileObject.profileInfo.organization);
  };

  useEffect(() => {
    if (profileName === null) {
      fetchProfileData();
    }
  }, [profileName]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Profile Information</Typography>

        <Typography>
          User WebId:{' '}
          <Link href={session.info.webId} target="_blank" rel="noreferrer">
            {session.info.webId}
          </Link>
        </Typography>

        {/* TODO: Refactor/optimize the form below once we have more input */}
        {/* fields to update profile for */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <ProfileInputField
            inputName="Name"
            inputValue={profileName}
            setInputValue={setProfileName}
            fetchProfileData={fetchProfileData}
          />
          <ProfileInputField
            inputName="Organization"
            inputValue={organization}
            setInputValue={setOrganization}
            fetchProfileData={fetchProfileData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
