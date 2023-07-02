// React Imports
import React from 'react';
// Material UI Imports
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

/**
 * DeleteClientModal Component - Component that allows users to delete other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Clients
 * @name DeleteClientModal
 */

const DeleteClientModal = ({
  showDeleteClientModal,
  setShowClientDeleteModal,
  client,
  handleDeleteClient
}) => (
  <Dialog
    open={showDeleteClientModal}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    onClose={() => setShowClientDeleteModal(false)}
  >
    <DialogTitle id="dialog-tile">Delete Client?</DialogTitle>

    <DialogContent>
      <DialogContentText id="dialog-description">
        {`You're about to delete ${client.person} from your client list, do you wish to continue?`}
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button
        variant="outlined"
        color="error"
        endIcon={<ClearIcon />}
        onClick={() => setShowClientDeleteModal(false)}
      >
        CANCEL
      </Button>

      <Button
        variant="contained"
        color="primary"
        endIcon={<CheckIcon />}
        sx={{ marginLeft: '1rem' }}
        onClick={handleDeleteClient}
      >
        DELETE CLIENT
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteClientModal;
