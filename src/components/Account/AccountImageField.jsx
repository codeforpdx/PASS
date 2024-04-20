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
 * AccountImageField Component - Component that creates the editable inputs fields
 * for the Account page
 *
 * @memberof Account
 * @name AccountImageField
 * @param {object} Props - Props used for NewMessage
 * @param {() => void} Props.loadAccountData - Handler function for setting local
 * state for profile card in PASS
 * @param {object} [Props.contactAccount] - Contact object with data from profile
 * or null if user profile is selected
 * @returns {React.JSX.Element} React component for NewMessage
 */
const AccountImageField = ({ loadAccountData, contactAccount }) => {
  const { addNotification } = useNotification();
  const { session } = useSession();
  const { accountData, fetchAccountInfo, removeAccountImage, uploadAccountImage } =
    useContext(SignedInUserContext);
  const [accountImg, setAccountImg] = useState(localStorage.getItem('accountImage'));
  const [processing, setProcessing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleAccountImage = async (event) => {
    if (event.target.files[0].size > 1 * 1000 * 1024) {
      addNotification('error', 'Account images have a maximum size of 1MB.');
    } else {
      await uploadAccountImage(session, accountData, event.target.files[0]);

      const updatedAccountData = await fetchAccountInfo(session.info.webId);
      localStorage.setItem('accountImage', updatedAccountData.accountInfo.accountImage);
      setAccountImg(updatedAccountData.accountInfo.accountImage);
      addNotification('success', `Account image added.`);
      loadAccountData();
    }
  };

  const handleRemoveAccountImg = async () => {
    setProcessing(true);
    try {
      await removeAccountImage(session, accountData);
      loadAccountData();
      localStorage.removeItem('accountImage');
      setAccountImg(null);
      addNotification('success', `Account image deleted from the pod.`);
    } catch (e) {
      addNotification('error', `Image deletion failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  const handleSelectRemoveAccountImg = async () => {
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
        src={contactAccount ? contactAccount.accountImage : accountImg}
        alt="PASS profile"
        sx={{ height: '100px', width: '100px', objectFit: 'contain' }}
      />
      {!contactAccount &&
        (accountImg ? (
          <Button
            variant="outlined"
            color="error"
            sx={{ width: '150px' }}
            onClick={handleSelectRemoveAccountImg}
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
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        title="Delete Image"
        text={"You're about to delete your account image. Do you wish to continue?"}
        onConfirm={handleRemoveAccountImg}
        confirmButtonText="Delete"
        processing={processing}
      />
    </Box>
  );
};

export default AccountImageField;
