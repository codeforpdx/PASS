// React Imports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// Component Imports
import ConfirmationButton from './ConfirmationButton';
import LogoutButton from './LogoutButton';

/**
 * ConfirmationModal Component - Component that allows users to cancel or
 * confirm their previously chosen action
 *
 * @memberof Modals
 * @name ConfirmationModal
 * @param {object} Props - Props used for ConfirmationModal
 * @param {boolean} Props.showConfirmationModal - toggle showing modal
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowConfirmationModal
 * - used to close the modal
 * @param {string} Props.title - text rendered in dialog title & confirmationButton
 * @param {string} Props.text - text rendered in dialog content text
 * @param {Function} Props.confirmFunction - method that runs onClick of button
 * @param {boolean} Props.processing - state used to disable button
 * @param {boolean} [Props.isLogout] - boolean to wrap button with inrupt logout
 * functionality
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
        <ConfirmationButton
          title={title}
          confirmFunction={confirmFunction}
          processing={processing}
        />
      </LogoutButton>
    ) : (
      <ConfirmationButton title={title} confirmFunction={confirmFunction} processing={processing} />
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
          endIcon={<ClearIcon />}
          onClick={() => setShowConfirmationModal(false)}
        >
          Cancel
        </Button>

        {confirmButton()}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
