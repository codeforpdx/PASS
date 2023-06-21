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
import { fetchProfileInfo, updateProfileInfo } from '../utils';
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

  const [profileName, setProfileName] = useState('');
  const [organization, setOrganization] = useState('');
  const [editProfileName, setEditProfileName] = useState(false);
  const [editOrganization, setEditOrganization] = useState(false);

  const handleEditProfileName = () => {
    setEditProfileName(!editProfileName);
  };

  const handleEditOrganization = () => {
    setEditOrganization(!editOrganization);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const profileData = await fetchProfileInfo(session);

    const updateObject = {
      name: profileName,
      organization
    };
    await updateProfileInfo(session, profileData, updateObject);

    setEditProfileName(false);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const profileObject = await fetchProfileInfo(session);

      if (profileObject.profileInfo.name === null) {
        setProfileName('No name set');
      } else {
        setProfileName(profileObject.profileInfo.name);
      }

      if (profileObject.profileInfo.organization === null) {
        setOrganization('No organization set');
      } else {
        setOrganization(profileObject.profileInfo.organization);
      }
    };

    if (profileName === '') {
      fetchProfileData();
    }
  }, [profileName]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Typography>
          User WebId: <Link href={session.info.webId}>{session.info.webId}</Link>
        </Typography>

        {/* TODO: Refactor/optimize the form below once we have more input */}
        {/* fields to update profile for */}
        <form
          onSubmit={handleUpdateProfile}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <ProfileInputField
            inputName="Name"
            inputValue={profileName}
            editInputValue={editProfileName}
            setInputValue={setProfileName}
            handleEditInput={handleEditProfileName}
          />
          <ProfileInputField
            inputName="Organization"
            inputValue={organization}
            editInputValue={editOrganization}
            setInputValue={setOrganization}
            handleEditInput={handleEditOrganization}
          />
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
