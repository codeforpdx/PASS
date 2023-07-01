// React Imports
import React, { useContext } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HideImageIcon from '@mui/icons-material/HideImage';
import ImageIcon from '@mui/icons-material/Image';
import InputLabel from '@mui/material/InputLabel';
// Contexts Imports
import { SignedInUserContext } from '../../contexts';

/**
 * profileImageFieldProps is an object that stores the props for the ProfileInputField
 * component
 *
 * @typedef profileImageFieldProps
 * @type {object}
 * @property {Blob} profileImg - The existing file blob being used for profile
 * card
 * @property {() => void} setProfileImg - Set function for profileImg
 * @memberof typedefs
 */

/**
 * ProfileImageField Component - Component that creates the editable inputs fields
 * for the Profile page
 *
 * @memberof Inbox
 * @name ProfileImageField
 * @param {profileImageFieldProps} Props - Props used for NewMessage
 * @returns {React.JSX.Element} React component for NewMessage
 */
const ProfileImageField = ({ profileImg, setProfileImg }) => {
  const { session } = useSession();
  const { profileData, loadProfileData, removeProfileImage, uploadProfileImage } =
    useContext(SignedInUserContext);

  const handleProfileImage = async (event) => {
    await uploadProfileImage(session, profileData, event.target.files[0]);

    loadProfileData();
  };

  const handleRemoveProfileImg = async () => {
    if (window.confirm("You're about to delete your profile image. Do you wish to continue?")) {
      await removeProfileImage(session, profileData);

      loadProfileData();
      localStorage.setItem('profileImageBlob', null);
      setProfileImg(null);
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
          <Avatar
            src={profileImg}
            alt="PASS profile"
            sx={{ height: '200px', width: '200px', objectFit: 'contain' }}
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
            onChange={handleProfileImage}
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
