// React Imports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// Component Imports
import LogoutButton from './LogoutButton';

/**
 * confirmationModalProps is an object that stores the props for the
 * ConfirmationModal component
 *
 * @typedef {object} confirmationModalProps
 * @property {boolean} showConfirmationModal - toggle showing modal
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowConfirmationModal - used to close the modal
 * @property {string} title - text rendered in dialog title
 * @property {string} text - text rendered in dialog content text & confirm button
 * @property {Function} confirmFunction - method that runs onClick of button
 * @property {boolean} processing - state used to disable button
 * @property {boolean} [isLogout] - boolean to wrap button with inrupt logout functionality
 * @memberof typedefs
 */

/**
 * ConfirmationModal Component - Component that allows users to cancel or
 * confirm their previously chosen action
 *
 * @memberof Modals
 * @name ConfirmationModal
 * @param {confirmationModalProps} props - Props used for ConfirmationModal
 * @returns {React.JSX.Element} - The confirmation modal
 */
const ConfirmationModal = ({
  showConfirmationModal,
  setShowConfirmationModal,
  title,
  text,
  confirmFunction,
  processing,
  isLogout = false
}) => {
  const confirmButton = () =>
    isLogout ? (
      <LogoutButton>
        <Button
          variant="contained"
          color="primary"
          aria-label="Confirm Button"
          endIcon={<CheckIcon />}
          onClick={confirmFunction}
          disabled={processing}
          sx={{ marginLeft: '1rem' }}
        >
          {title.toUpperCase()}
        </Button>
      </LogoutButton>
    ) : (
      <Button
        variant="contained"
        color="primary"
        aria-label="Confirm Button"
        endIcon={<CheckIcon />}
        onClick={confirmFunction}
        disabled={processing}
        sx={{ marginLeft: '1rem' }}
      >
        {title.toUpperCase()}
      </Button>
    );

  return (
    <Dialog
      open={showConfirmationModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={() => setShowConfirmationModal(false)}
    >
      <DialogTitle id="dialog-title">{title.toUpperCase()}</DialogTitle>

      <DialogContent>
        <DialogContentText id="dialog-description">{text}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          aria-label="Cancel Button"
          endIcon={<ClearIcon />}
          onClick={() => setShowConfirmationModal(false)}
        >
          CANCEL
        </Button>

        {confirmButton()}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
