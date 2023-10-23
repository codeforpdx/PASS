// React Imports
import React from 'react';
// Material UI Imports
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OidcLoginComponent from '../NavBar/OidcLoginComponent';

const SignInModal = ({ showSignInModal, setShowSignInModal }) => (
  <Dialog
    open={showSignInModal}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    onClose={() => setShowSignInModal(false)}
  >
    <DialogTitle id="dialog-title">Sign In?</DialogTitle>

    <DialogContent>
      <DialogContentText id="dialog-description">Welcome to PASS. Sign in below</DialogContentText>
    </DialogContent>

    <DialogActions>
      <OidcLoginComponent />
    </DialogActions>
  </Dialog>
);

export default SignInModal;
