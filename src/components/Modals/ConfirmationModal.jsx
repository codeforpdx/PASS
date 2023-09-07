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
// Custom Hook Imports
import { useStatusNotification } from '@hooks';
// Component Imports
import { FormSection } from '../Form';

// ULTIMATE GOAL:
// Replace LogoutModal, DeleteContactModal, DeleteDocumentModal
// Could replace all test files for the above, to just one file for ConfirmationModal

// TODO:
// need to have parent component house state of showConfirmationModal and setShowConfirmationModal

// ISSUES TO CHANGE:
// <FormSection> is only needed for old notification system. Only keep if necessary to have "doing this..." notifications when running function & haven't done that in another way.
// useStatusNotification & state,dispatch only needed for old notification system.
// <form> is only needed if using <FormSection>. If not using, move submit function to YES button onClick.

// ARGUMENTS TO PASS:
// showConfirmationModal and setter states
// dialog title - <DialogTitle> : title
// confirmation text - <DialogContentText> : text
// aria-label for YES button - label needed for testing and screen-reader : label
// delete/yes function - function to run on button click : function

// DONT FORGET:
// jsDoc stuff

const ConfirmationModal = ({
  showConfirmationModal,
  setShowConfirmationModal,
  title,
  text,
  confirmButtonAriaLabel,
  confirmButtonFunction,
  confirmButtonText
}) => {
  const { state, dispatch } = useStatusNotification();

  return (
    <Dialog
      open={showConfirmationModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={() => setShowConfirmationModal(false)}
    >
      <FormSection
        title="Delete Document"
        state={state}
        statusType="Status"
        defaultMessage="To be deleted..."
      >
        <form onSubmit={confirmButtonFunction} autoComplete="off">
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
              type="submit"
              variant="contained"
              color="primary"
              // can I make this aria-label just "yes-button", so no need to pass argument?
              // would need to change the test
              aria-label={confirmButtonAriaLabel}
              endIcon={<CheckIcon />}
              // change disabled if not using old notification system
              disabled={state.processing}
              sx={{ marginLeft: '1rem' }}
            >
              {confirmButtonText}
            </Button>
          </DialogActions>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default ConfirmationModal;
