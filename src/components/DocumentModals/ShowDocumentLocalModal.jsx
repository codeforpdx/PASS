// React Imports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * ShowDocumentsModal Component - Popup modal that shows client documents if gotten
 * explicit permission via ACL
 *
 * @memberof Clients
 * @name ShowDocumentLocalModal
 */

const ShowDocumentLocalModal = ({ showModal, setShowModal, fileBlobUrl }) => (
  <Dialog
    open={showModal}
    aria-labelledby="dialog-title"
    onClose={() => setShowModal(false)}
    sx={{ width: '90%' }}
  >
    <DialogTitle id="dialog-tile">Documents</DialogTitle>

    <DialogContent>
      <iframe src={fileBlobUrl} title="File Preview Local" height={800} width={700} />
    </DialogContent>
    <DialogActions>
      <Button
        variant="outlined"
        color="error"
        endIcon={<ClearIcon />}
        onClick={() => setShowModal(false)}
      >
        CLOSE
      </Button>
    </DialogActions>
  </Dialog>
);

export default ShowDocumentLocalModal;
