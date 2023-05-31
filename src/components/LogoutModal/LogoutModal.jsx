// React Imports
import React from 'react';
// Solid Imports
import { LogoutButton } from '@inrupt/solid-ui-react';
// Material UI Imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';


/**
 * LogoutModal Component - Popup modal for users to confirm
 * they actually want to logout of their Solid Pod
 *
 * @memberof Login
 * @name LogoutModal
 */

const LogoutModal = ({ showConfirmation, setShowConfirmation, handleLogout }) => (

  <Dialog
    open={showConfirmation}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    onClose={() => setShowConfirmation(false)}
  >
    <DialogTitle id="dialog-tile">Log out?</DialogTitle>

    <DialogContent>
      <DialogContentText id="dialog-description">
        This will log you out of your pod. Are you sure?
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button
        variant="outlined"
        color="error"
        endIcon={<ClearIcon />}
        onClick={() => setShowConfirmation(false)}
      >
        NO
      </Button>
      {/* NECESSARY WRAPPER FOR SOLID/POD LOGOUT FUNCTIONALITY */}
      <LogoutButton>
        <Button
          variant="outlined"
          color="success"
          endIcon={<CheckIcon />}
          sx={{ marginLeft: '1rem' }}
          onClick={handleLogout}
        >
          YES
        </Button>
      </LogoutButton>
    </DialogActions>
  </Dialog>
);

export default LogoutModal;
