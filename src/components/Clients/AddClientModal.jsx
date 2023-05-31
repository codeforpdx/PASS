// React Imports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { ManageUsers } from '../Form';


/**
 * AddClientModal Component - Popup modal for users to add a client to their client list
 *
 * @memberof Clients
 * @name AddClientModal
 */

const AddClientModal = ({ showModal, setShowModal }) => (

  <Dialog
    open={showModal}
    aria-labelledby="dialog-title"
    onClose={() => setShowModal(false)}
  >
    <DialogTitle id="dialog-tile">Add Client</DialogTitle>

    <DialogContent>
      <ManageUsers />
    </DialogContent>

    <DialogActions>
      <Button
        variant="outlined"
        color="error"
        endIcon={<ClearIcon />}
        onClick={() => setShowModal(false)}
      >
        NO
      </Button>
      <Button
        variant="outlined"
        color="success"
        endIcon={<CheckIcon />}
        onClick={() => setShowModal(false)}
        sx={{ marginLeft: '1rem' }}
      >
        YES
      </Button>
    </DialogActions>
  </Dialog>
);

export default AddClientModal;
