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
// Contexts Imports
import { SignedInUserContext } from '@contexts';
import useNotification from '../../hooks/useNotification';
// Component Imports
import ConfirmationModal from '../Modals/ConfirmationModal';

/**
 * ProfileImageField - Component that creates the editable inputs fields
 * for the Profile page
 *
 * @memberof Profile
 * @name ProfileImageField
 * @param {object} Props - Props used for NewMessage
 * @param {() => void} Props.loadProfileData - Handler function for setting local
 * state for profile card in PASS
 * @param {object} [Props.contactProfile] - Contact object with data from profile
 * or null if user profile is selected
 * @returns {React.JSX.Element} React component for NewMessage
 */
const ProfileImageField = ({ loadProfileData, contactProfile }) => {
  const { addNotification } = useNotification();
  const { session } = useSession();
  const { profileData, fetchProfileInfo, removeProfileImage, uploadProfileImage } =
    useContext(SignedInUserContext);
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImage'));
  const [processing, setProcessing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleProfileImage = async (event) => {
    if (event.target.files[0].size > 1 * 1000 * 1024) {
      addNotification('error', 'Profile images have a maximum size of 1MB.');
    } else {
      await uploadProfileImage(session, profileData, event.target.files[0]);

      const updatedProfileData = await fetchProfileInfo(session.info.webId);
      localStorage.setItem('profileImage', updatedProfileData.profileInfo.profileImage);
      setProfileImg(updatedProfileData.profileInfo.profileImage);
      addNotification('success', `Profile image added.`);
      loadProfileData();
    }
  };

  const handleRemoveProfileImg = async () => {
    setProcessing(true);
    try {
      await removeProfileImage(session, profileData);
      loadProfileData();
      localStorage.removeItem('profileImage');
      setProfileImg(null);
      addNotification('success', `Profile image deleted from the pod.`);
    } catch (e) {
      addNotification('error', `Image deletion failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  const handleSelectRemoveProfileImg = async () => {
    setShowConfirmationModal(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        gap: '10px'
      }}
    >
      <Avatar
        src={contactProfile ? contactProfile.profileImage : profileImg}
        alt="PASS profile"
        sx={{ height: '100px', width: '100px', objectFit: 'contain' }}
      />
      {!contactProfile &&
        (profileImg ? (
          <Button
            variant="outlined"
            color="error"
            sx={{ width: '150px' }}
            onClick={handleSelectRemoveProfileImg}
            endIcon={<HideImageIcon />}
          >
            Remove Img
          </Button>
        ) : (
          <Button
            variant="outlined"
            component="label"
            color="primary"
            onChange={handleProfileImage}
            endIcon={<ImageIcon />}
            sx={{ width: '150px' }}
          >
            Choose Img
            <input type="file" hidden accept=".gif, .png, .jpeg, .jpg, .webp" />
          </Button>
        ))}
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        title="Delete Image"
        text={"You're about to delete your profile image. Do you wish to continue?"}
        onConfirm={handleRemoveProfileImg}
        confirmButtonText="Delete"
        processing={processing}
      />
    </Box>
  );
};

export default ProfileImageField;
