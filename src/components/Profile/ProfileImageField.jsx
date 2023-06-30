// React Imports
import React from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HideImageIcon from '@mui/icons-material/HideImage';
import ImageIcon from '@mui/icons-material/Image';
import InputLabel from '@mui/material/InputLabel';
// Utility Imports
import { fetchProfileInfo, removeProfileImage, uploadProfileImg } from '../../model-helpers';

const ProfileImageField = ({ loadProfileData, imgFile, setImgFile, profileImg }) => {
  const { session } = useSession();

  const handleProfileImage = async () => {
    const profileData = await fetchProfileInfo(session);

    await uploadProfileImg(session, profileData, imgFile);

    loadProfileData();
  };

  const handleRemoveProfileImg = async () => {
    if (window.confirm("You're about to delete your profile image. Do you wish to continue?")) {
      const profileData = await fetchProfileInfo(session);
      await removeProfileImage(session, profileData);

      loadProfileData();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '300px',
        alignItems: 'flex-start',
        gap: '10px'
      }}
    >
      <InputLabel htmlFor="input-profile-pic" sx={{ color: 'black' }}>
        Profile Image:{' '}
      </InputLabel>
      {profileImg ? (
        <>
          <img
            src={profileImg}
            alt="PASS profile"
            style={{ height: '200px', objectFit: 'contain' }}
          />
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="outlined"
              color="error"
              sx={{ width: '150px' }}
              onClick={handleRemoveProfileImg}
              endIcon={<HideImageIcon />}
            >
              Remove Img
            </Button>
          </Box>
        </>
      ) : (
        <>
          <AccountCircleIcon sx={{ height: '200px', width: '200px', color: 'lightgray' }} />
          <Button
            variant="outlined"
            component="label"
            color="primary"
            id="input-profile-pic"
            name="inputProfilePic"
            onChange={async (e) => {
              setImgFile(e.target.files[0]);
              await handleProfileImage(e);
            }}
            endIcon={<ImageIcon />}
            sx={{ width: '150px' }}
          >
            Choose Img
            <input type="file" hidden accept=".gif, .png, .tiff, .jpeg, .jpg, .webp" />
          </Button>
        </>
      )}
    </Box>
  );
};

export default ProfileImageField;
