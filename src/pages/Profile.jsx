// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// Contexts Imports
import { SignedInUserContext } from '../contexts';
// Component Inputs
import { ProfileInputField, ProfileImageField } from '../components/Profile';

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
  const { podUrl, updateProfileInfo, setProfileData, profileData, fetchProfileInfo } =
    useContext(SignedInUserContext);

  localStorage.setItem('restorePath', location.pathname);

  const [profileName, setProfileName] = useState(profileData?.profileInfo.profileName);
  const [nickname, setNickname] = useState(profileData?.profileInfo.nickname);

  const [edit, setEdit] = useState(false);

  const loadProfileData = async () => {
    const profileDataSolid = await fetchProfileInfo(session);
    setProfileData(profileDataSolid);

    setProfileName(profileDataSolid.profileInfo.profileName);
    setNickname(profileDataSolid.profileInfo.nickname);
  };

  const handleCancelEdit = () => {
    loadProfileData();

    setEdit(!edit);
  };

  const handleEditInput = () => {
    setEdit(!edit);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    const inputValues = {
      profileName,
      nickname
    };

    await updateProfileInfo(session, profileData, inputValues);

    loadProfileData();
    setEdit(false);
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Profile Information</Typography>
        <Typography>
          Your Signup Link:{' '}
          <Link
            href={`${window.location.origin}/signup?podUrl=${podUrl}`}
          >{`${window.location.origin}/signup?podUrl=${podUrl}`}</Link>
        </Typography>
        <Typography>
          User WebId:{' '}
          <Link href={session.info.webId} target="_blank" rel="noreferrer">
            {session.info.webId}
          </Link>
        </Typography>

        {/* TODO: Refactor/optimize the form below once we have more input */}
        {/* fields to update profile for */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <form onSubmit={handleUpdateProfile}>
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                marginBottom: 2
              }}
            >
              {edit ? (
                <>
                  <Button
                    variant="outlined"
                    type="button"
                    color="error"
                    endIcon={<ClearIcon />}
                    onClick={handleCancelEdit}
                    sx={{ width: '100px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    endIcon={<CheckIcon />}
                    sx={{ width: '100px' }}
                  >
                    Update
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  type="button"
                  color="primary"
                  endIcon={<EditIcon />}
                  onClick={handleEditInput}
                  sx={{ width: '100px' }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <ProfileInputField
                inputName="Name"
                inputValue={profileName}
                setInputValue={setProfileName}
                edit={edit}
              />
              <ProfileInputField
                inputName="Nickname"
                inputValue={nickname}
                setInputValue={setNickname}
                edit={edit}
              />
            </Box>
          </form>
          <ProfileImageField loadProfileData={loadProfileData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
