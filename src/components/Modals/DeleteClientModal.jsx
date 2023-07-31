// React Imports
import React, { useContext, useState } from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// Utility Imports
import { runNotification } from '@utils';
// Context Imports
import { UserListContext } from '@contexts';
// Custom Hook Imports
import { useNotification } from '../../hooks/useNotification';
// Component Imports
import { FormSection } from '../Form';

/**
 * DeleteClientModal Component - Component that allows users to delete other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Clients
 * @name DeleteClientModal
 */

const DeleteClientModal = ({
  showDeleteClientModal = false,
  setShowDeleteClientModal,
  selectedClientToDelete
}) => {
  const notify = useNotification();
  const { removeUser } = useContext(UserListContext);
  const [showSpinner, setShowSpinner] = useState(false);
  // Event handler for deleting client from client list
  const handleDeleteClient = async (event) => {
    event.preventDefault();
    setShowSpinner(true);
    // notify.addNotification('info',`Deleting "${selectedClientToDelete?.person}" from client list...`)
    try {
      await removeUser(selectedClientToDelete);
    } catch (e) {
      runNotification(`Client deletion failed. Reason: ${e.message}`);
    } finally {
      notify.addNotification(
        'success',
        `"${selectedClientToDelete?.person}" deleted from client list...`
      );
      setShowSpinner(false);
      setTimeout(() => {
        setShowDeleteClientModal(false);
      }, 2000);
    }
  };
  
  return (
    <Dialog
      open={showDeleteClientModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={() => setShowDeleteClientModal(false)}
    >
      <FormSection
        title="Delete Client"
        showSpinner={showSpinner}
        statusType="Status"
        defaultMessage="To be deleted..."
      >
        <form onSubmit={handleDeleteClient} autoComplete="off">
          <DialogContent>
            <DialogContentText id="dialog-description">
              {`Are you sure you want to delete "${selectedClientToDelete?.person}" from your client list?`}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              aria-label="Cancel Button"
              endIcon={<ClearIcon />}
              onClick={() => setShowDeleteClientModal(false)}
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              aria-label="Delete Client Button"
              endIcon={<CheckIcon />}
              sx={{ marginLeft: '1rem' }}
            >
              DELETE CLIENT
            </Button>
          </DialogActions>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default DeleteClientModal;
