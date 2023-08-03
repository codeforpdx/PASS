// React Imports
import React, { useContext } from 'react';
// Custom Hook Imports
import { useStatusNotification } from '@hooks';
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
  const { state, dispatch } = useStatusNotification();
  const { removeUser } = useContext(UserListContext);

  // Event handler for deleting client from client list
  const handleDeleteClient = async (event) => {
    event.preventDefault();
    runNotification(
      `Deleting "${selectedClientToDelete?.person}" from client list...`,
      5,
      state,
      dispatch
    );
    try {
      await removeUser(selectedClientToDelete);
    } catch (e) {
      runNotification(`Client deletion failed. Reason: ${e.message}`);
    } finally {
      runNotification(
        `"${selectedClientToDelete?.person}" deleted from client list...`,
        5,
        state,
        dispatch
      );

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
        state={state}
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
              disabled={state.processing}
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
