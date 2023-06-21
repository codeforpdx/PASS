// React Imports
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// Utility Imports
import { fetchProfileInfo, updateProfileInfo } from '../utils';

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

  const handleGetProfileInfo = async () => {
    const profileObject = await fetchProfileInfo(session);

    if (profileObject.profileInfo.name === null) {
      setProfileName('No name set');
    } else {
      setProfileName(profileObject.name);
    }

    if (profileObject.profileInfo.organization === null) {
      setOrganization('No organization set');
    } else {
      setOrganization(profileObject.organization);
    }
  };

  const handleEditProfileName = () => {
    setEditProfileName(!editProfileName);
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

  const handleEditOrganization = () => {
    setEditOrganization(!editOrganization);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
      <Button
        variant="contained"
        type="button"
        onClick={handleGetProfileInfo}
        sx={{ width: '150px' }}
      >
        Get Profile
      </Button>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {editProfileName ? (
                <>
                  <Typography>Name: </Typography>
                  <Input
                    value={profileName}
                    placeholder={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </>
              ) : (
                <Typography>Name: {profileName}</Typography>
              )}
              {profileName && (
                <Button variant="outlined" type="button" onClick={handleEditProfileName}>
                  {editProfileName ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </Box>
            {profileName && editProfileName && (
              <Button variant="outlined" type="submit">
                Update
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {editOrganization ? (
                <>
                  <Typography>Organization: </Typography>
                  <Input
                    value={organization}
                    placeholder={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </>
              ) : (
                <Typography>Organization: {organization}</Typography>
              )}
              {profileName && (
                <Button variant="outlined" type="button" onClick={handleEditOrganization}>
                  {editOrganization ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </Box>
            {organization && editOrganization && (
              <Button variant="outlined" type="submit">
                Update
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
