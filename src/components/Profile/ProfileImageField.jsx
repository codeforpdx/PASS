// React Imports
import React, { useContext, useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HideImageIcon from '@mui/icons-material/HideImage';
import ImageIcon from '@mui/icons-material/Image';
import Typography from '@mui/material/Typography';
// Contexts Imports
import { SignedInUserContext } from '@contexts';

/**
 * @typedef {import("../../typedefs").profileImageFieldProps} profileImageFieldProps
 */

/**
 * ProfileImageField Component - Component that creates the editable inputs fields
 * for the Profile page
 *
 * @memberof Profile
 * @name ProfileImageField
 * @param {profileImageFieldProps} Props - Props used for NewMessage
 * @returns {React.JSX.Element} React component for NewMessage
 */
const ProfileImageField = ({ loadProfileData, clientProfile }) => {
  const { session } = useSession();
  const { profileData, fetchProfileInfo, removeProfileImage, uploadProfileImage } =
    useContext(SignedInUserContext);
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImage'));

  const handleProfileImage = async (event) => {
    await uploadProfileImage(session, profileData, event.target.files[0]);

    const updatedProfileData = await fetchProfileInfo(session.info.webId);
    localStorage.setItem('profileImage', updatedProfileData.profileInfo.profileImage);
    setProfileImg(updatedProfileData.profileInfo.profileImage);

    loadProfileData();
  };

  const handleRemoveProfileImg = async () => {
    if (window.confirm("You're about to delete your profile image. Do you wish to continue?")) {
      await removeProfileImage(session, profileData);

      loadProfileData();
      localStorage.removeItem('profileImage');
      setProfileImg(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 0 3px 0 black',
        padding: '20px',
        gap: '10px'
      }}
    >
      <Typography color="black">Profile Image: </Typography>
      <Avatar
        src={clientProfile ? clientProfile?.profileImg : profileImg}
        alt="PASS profile"
        sx={{ height: '100px', width: '100px', objectFit: 'contain' }}
      />
      {!clientProfile &&
        (profileImg ? (
          <Button
            variant="outlined"
            color="error"
            sx={{ width: '150px' }}
            onClick={handleRemoveProfileImg}
            endIcon={<HideImageIcon />}
          >
            Remove Img
          </Button>
        ) : (
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
            <input type="file" hidden accept=".gif, .png, .jpeg, .jpg, .webp" />
          </Button>
        ))}
    </Box>
  );
};

export default ProfileImageField;
