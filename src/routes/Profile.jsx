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

  const [profileName, setProfileName] = useState(null);
  const [memberOf, setMemberOf] = useState(null);
  const [editProfileName, setEditProfileName] = useState(false);
  const [editMemberOf, setEditMemberOf] = useState(false);

  const handleEditProfileName = () => {
    setEditProfileName(!editProfileName);
  };

  const handleMemberOf = () => {
    setEditMemberOf(!editMemberOf);
  };

  const fetchProfileData = async () => {
    const profileObject = await fetchProfileInfo(session);

    if (profileObject.profileInfo.profileName !== null) {
      setProfileName(profileObject.profileInfo.profileName);
    } else {
      setProfileName('No name set');
    }

    if (profileObject.profileInfo.memberOf !== null) {
      setMemberOf(profileObject.profileInfo.memberOf);
    } else {
      setMemberOf('No organization set');
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const profileData = await fetchProfileInfo(session);
    let inputValue;
    let inputField;

    if (editProfileName) {
      inputValue = profileName;
      inputField = 'profileName';
    } else if (editMemberOf) {
      inputValue = memberOf;
      inputField = 'memberOf';
    }

    await updateProfileInfo(session, profileData, inputField, inputValue);

    fetchProfileData();
    setEditProfileName(false);
    setEditMemberOf(false);
  };

  useEffect(() => {
    if (profileName === null) {
      fetchProfileData();
    }
  }, [profileName]);

  const handleCancelEdit = (handleEditFunction) => {
    fetchProfileData();

    handleEditFunction();
  };

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
        <form
          onSubmit={handleUpdateProfile}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <ProfileInputField
            inputName="Name"
            inputValue={profileName}
            editInputValue={editProfileName}
            setInputValue={setProfileName}
            handleEditInput={handleEditProfileName}
            handleCancelEdit={handleCancelEdit}
          />
          <ProfileInputField
            inputName="Organization"
            inputValue={memberOf}
            editInputValue={editMemberOf}
            setInputValue={setMemberOf}
            handleEditInput={handleMemberOf}
            handleCancelEdit={handleCancelEdit}
          />
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
