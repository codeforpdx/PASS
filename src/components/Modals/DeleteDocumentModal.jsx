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
import { DocumentListContext } from '@contexts';
// Component Imports
import { FormSection } from '../Form';

/**
 * @typedef {import("../../typedefs.js").deleteDocumentModalProps} deleteDocumentModalProps
 */

/**
 * DeleteDocumentModal Component - Component that allows users to delete their
 * document from the document list stored on their own Pod
 *
 * @memberof Modals
 * @name DeleteDocumentModal
 * @param {deleteDocumentModalProps} Props - Props for DeleteDocumentModal component
 * @returns {React.JSX.Element} The DeleteDocumentModal Component
 */
const DeleteDocumentModal = ({
  showDeleteDocumentModal = false,
  setShowDeleteDocumentModal,
  selectedDocumentToDelete
}) => {
  const { state, dispatch } = useStatusNotification();
  const { removeDocument } = useContext(DocumentListContext);

  // Event handler for deleting client from client list
  const handleDeleteDocument = async (event) => {
    event.preventDefault();
    runNotification(
      `Deleting "${selectedDocumentToDelete?.name}" from document list...`,
      5,
      state,
      dispatch
    );
    try {
      await removeDocument(selectedDocumentToDelete?.name);
    } catch (e) {
      runNotification(`Document deletion failed. Reason: ${e.message}`);
    } finally {
      runNotification(
        `"${selectedDocumentToDelete?.name}" deleted from document list...`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        setShowDeleteDocumentModal(false);
      }, 2000);
    }
  };

  return (
    <Dialog
      open={showDeleteDocumentModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={() => setShowDeleteDocumentModal(false)}
    >
      <FormSection
        title="Delete Document"
        state={state}
        statusType="Status"
        defaultMessage="To be deleted..."
      >
        <form onSubmit={handleDeleteDocument} autoComplete="off">
          <DialogContent>
            <DialogContentText id="dialog-description">
              {`Are you sure you want to delete "${selectedDocumentToDelete?.name}" from your document list?`}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              aria-label="Cancel Button"
              endIcon={<ClearIcon />}
              onClick={() => setShowDeleteDocumentModal(false)}
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              aria-label="Delete Document Button"
              endIcon={<CheckIcon />}
              disabled={state.processing}
              sx={{ marginLeft: '1rem' }}
            >
              DELETE DOCUMENT
            </Button>
          </DialogActions>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default DeleteDocumentModal;
