// React Imports
import React from 'react';
// Material UI Imports
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OidcLoginComponent from '../NavBar/OidcLoginComponent';

/**
 * The SignInModal Component is a component that renders the Sign In modal which
 * logs people into PASS. It only appears for the mobile version of PASS
 *
 * @memberof Modals
 * @name SignInModal
 * @param {object} Props - The props for SignInModal Component
 * @param {boolean} Props.showSignInModal - The state for showing the modal
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowSignInModal
 * - The set function for handling the Sign In modal
 * @returns {React.JSX.Element} - The SignInModal Component
 */
const SignInModal = ({ showSignInModal, setShowSignInModal }) => (
  <Dialog
    open={showSignInModal}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    onClose={() => setShowSignInModal(false)}
    PaperProps={{ sx: { maxHeight: '20rem', overflow: 'clip' } }}
  >
    <DialogTitle id="dialog-title" textAlign="center">
      Sign In
    </DialogTitle>

    <DialogContent>
      <DialogContentText id="dialog-description" textAlign="center">
        Please select a Solid Server to log in
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <OidcLoginComponent setShowSignInModal={setShowSignInModal} />
    </DialogActions>
  </Dialog>
);

export default SignInModal;
