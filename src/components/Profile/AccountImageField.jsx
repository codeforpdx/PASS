// React Imports
import React, { useContext, useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import HideImageIcon from '@mui/icons-material/HideImage';
import ImageIcon from '@mui/icons-material/Image';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// Contexts Imports
import { SignedInUserContext } from '@contexts';
import useNotification from '../../hooks/useNotification';

/**
 * AccountImageField Component - Component that creates the editable
 * account avatar image selector for the Account page
 *
 * @memberof Profile
 * @name AccountImageField
 * @param {object} Props - Props used for NewMessage
 * @param {() => void} Props.loadAccountData - Handler function for setting local
 * state for profile card in PASS
 * @param {object} [Props.contactProfile] - Contact object with data from profile
 * or null if user account is selected
 * @returns {React.JSX.Element} React component for NewMessage
 */
const AccountImageField = ({ loadAccountData, contactProfile }) => {
  const { addNotification } = useNotification();
  const { session } = useSession();
  const { profileData, fetchProfileInfo, removeProfileImage, uploadProfileImage } =
    useContext(SignedInUserContext);
  const [accountImg, setAccountImg] = useState(localStorage.getItem('profileImage'));

  const handleAccountImage = async (event) => {
    if (event.target.files[0].size > 1 * 1000 * 1024) {
      addNotification('error', 'Account images have a maximum size of 1MB.');
    } else {
      await uploadProfileImage(session, profileData, event.target.files[0]);

      const updatedAccountData = await fetchProfileInfo(session.info.webId);
      localStorage.setItem('profileImage', updatedAccountData.profileInfo.profileImage);
      setAccountImg(updatedAccountData.profileInfo.profileImage);

      loadAccountData();
    }
  };

  const handleRemoveAccountImg = async () => {
    if (window.confirm("You're about to delete your account image. Do you wish to continue?")) {
      await removeProfileImage(session, profileData);

      loadAccountData();
      localStorage.removeItem('profileImage');
      setAccountImg(null);
    }
  };

  return (
    <Stack
      spacing={1}
      justifyContent="center"
      alignItems="center"
      padding="20px"
      boxShadow="0 0 3px 0 black"
    >
      <Typography color="black">Account Image: </Typography>
      <Avatar
        src={contactProfile ? contactProfile.profileImage : accountImg}
        alt="PASS account"
        sx={{ height: '100px', width: '100px', objectFit: 'contain' }}
      />
      {!contactProfile &&
        (accountImg ? (
          <Button
            variant="outlined"
            color="error"
            sx={{ width: '150px' }}
            onClick={handleRemoveAccountImg}
            endIcon={<HideImageIcon />}
          >
            Remove Img
          </Button>
        ) : (
          <Button
            variant="outlined"
            component="label"
            color="primary"
            onChange={handleAccountImage}
            endIcon={<ImageIcon />}
            sx={{ width: '150px' }}
          >
            Choose Img
            <input type="file" hidden accept=".gif, .png, .jpeg, .jpg, .webp" />
          </Button>
        ))}
    </Stack>
  );
};

export default AccountImageField;
