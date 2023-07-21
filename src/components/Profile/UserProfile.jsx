// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Inputs
import ProfileImageField from './ProfileImageField';
import ProfileInputField from './ProfileInputField';

const UserProfile = () => {
  const { session } = useSession();
  const { updateProfileInfo, setProfileData, profileData, fetchProfileInfo } =
    useContext(SignedInUserContext);

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
    <Box
      style={{
        display: 'flex',
        gap: '15px',
        padding: '10px'
      }}
    >
      <ProfileImageField loadProfileData={loadProfileData} />
      <form
        onSubmit={handleUpdateProfile}
        style={{
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 3px 0 black',
          justifyContent: 'space-between',
          padding: '20px'
        }}
      >
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
        <Box
          sx={{
            display: 'flex',
            gap: '10px'
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
      </form>
    </Box>
  );
};

export default UserProfile;
