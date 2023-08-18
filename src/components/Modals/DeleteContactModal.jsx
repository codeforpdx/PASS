// React Imports
import React from 'react';
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
// Component Imports
import { FormSection } from '../Form';
import useNotification from '../../hooks/useNotification';

/**
 * @typedef {object} DeleteContactModalParams
 * @property {boolean} showDeleteContactModal - toggle showing modal
 * @property {Function} setShowDeleteContactModal - used to close the modal
 * @property {object} selectedContactToDelete - contact object to delete
 * @property {Function} deleteContact - method that deletes contact
 */

/**
 * DeleteContactModal Component - Component that allows users to delete other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Modals
 * @name DeleteContactModal
 * @param {DeleteContactModalParams} props - params
 * @returns {React.JSX.Element} - The delete contact modal
 */
const DeleteContactModal = ({
  showDeleteContactModal = false,
  setShowDeleteContactModal,
  selectedContactToDelete,
  deleteContact
}) => {
  const { state, dispatch } = useStatusNotification();
  const { addNotification } = useNotification();

  // Event handler for deleting from contact list
  const handleDeleteContact = async (event) => {
    event.preventDefault();
    runNotification(
      `Deleting "${selectedContactToDelete?.person}" from contact list...`,
      5,
      state,
      dispatch
    );
    try {
      await deleteContact(selectedContactToDelete);
      runNotification(
        `"${selectedContactToDelete?.person}" deleted from contact list...`,
        5,
        state,
        dispatch
      );
      addNotification(
        'success',
        `"${selectedContactToDelete?.person}" deleted from contact list...`
      );
    } catch (e) {
      runNotification(`Contact deletion falied. Reason: ${e.message}`);
      addNotification('error', `Contact deletion falied. Reason: ${e.message}`);
    } finally {
      setTimeout(() => {
        setShowDeleteContactModal(false);
      }, 2000);
    }
  };

  return (
    <Dialog
      open={showDeleteContactModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={() => setShowDeleteContactModal(false)}
    >
      <FormSection
        title="Delete Contact"
        state={state}
        statusType="Status"
        defaultMessage="To be deleted..."
      >
        <form onSubmit={handleDeleteContact} autoComplete="off">
          <DialogContent>
            <DialogContentText id="dialog-description">
              {`Are you sure you want to delete "${selectedContactToDelete?.person}" from your contact list?`}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              aria-label="Cancel Button"
              endIcon={<ClearIcon />}
              onClick={() => setShowDeleteContactModal(false)}
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              aria-label="Delete Contact Button"
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

export default DeleteContactModal;
