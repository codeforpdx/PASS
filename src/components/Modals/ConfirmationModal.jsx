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

// ULTIMATE GOAL:
// Replace LogoutModal, DeleteContactModal, DeleteDocumentModal
// Could replace all test files for the above, to just one file for ConfirmationModal

// TODO:
// need to have parent component house state of showConfirmationModal and setShowConfirmationModal

/**
 * @typedef {import("../../typedefs.js").confirmationModalProps} confirmationModalProps
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
  confirmButtonAriaLabel,
  confirmButtonFunction,
  confirmButtonText,
  processing
}) => (
  <Dialog
    open={showConfirmationModal}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    onClose={() => setShowConfirmationModal(false)}
  >
    <DialogTitle id="dialog-title">{title}</DialogTitle>

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

      <Button
        variant="contained"
        color="primary"
        // can I make this aria-label just "yes-button", so no need to pass argument?
        // would need to change the test
        aria-label={confirmButtonAriaLabel}
        endIcon={<CheckIcon />}
        onClick={confirmButtonFunction}
        disabled={processing}
        sx={{ marginLeft: '1rem' }}
      >
        {confirmButtonText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationModal;
