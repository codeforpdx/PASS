// React Imports
import React, { useContext } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
 * @property {() => void} loadProfileData - The handler function for loading
 * data from profile card
 * @property {Blob} imgFile - The file blob user wish to upload into their profile
 * card
 * @property {(value: React.SetStateAction<null>) => void} setImgFile - Set
 * function for profile image
 * @property {Blob} profileImg - The existing file blob being used for profile
 * card
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
const ProfileImageField = ({ loadProfileData, imgFile, setImgFile, profileImg }) => {
  const { session } = useSession();
  const { fetchProfileInfo, removeProfileImage, uploadProfileImg } =
    useContext(SignedInUserContext);

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
