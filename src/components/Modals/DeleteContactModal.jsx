// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// Component Imports
import useNotification from '@hooks/useNotification';
import { FormSection } from '../Form';

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
  const { addNotification } = useNotification();
  const [processing, setProcessing] = useState(false);

  // Event handler for deleting from contact list
  const handleDeleteContact = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      await deleteContact(selectedContactToDelete);
      addNotification('success', `"${selectedContactToDelete?.person}" deleted from contact list.`);
    } catch (e) {
      addNotification('error', `Contact deletion failed. Reason: ${e.message}`);
    } finally {
      setTimeout(() => {
        setShowDeleteContactModal(false);
        setProcessing(false);
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
      <FormSection title="Delete Contact">
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
              disabled={processing}
              variant="contained"
              color="primary"
              aria-label="Delete Contact Button"
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

export default DeleteContactModal;
