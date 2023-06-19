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
 * ShowDocumentPreviewModal Component - Popup modal that shows the user or client's
 * specific documents if gotten explicit permission via ACL
 *
 * @memberof DocumentModals
 * @name ShowDocumentPreviewModal
 */

const ShowDocumentPreviewModal = ({ showModal, setShowModal, fileBlobUrl }) => (
  <Dialog
    fullScreen
    open={showModal}
    aria-labelledby="dialog-title"
    onClose={() => setShowModal(false)}
  >
    <DialogTitle id="dialog-tile">Documents</DialogTitle>

    <DialogContent
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
      }}
    >
      <iframe src={fileBlobUrl} title="File Preview Local" height="100%" width="100%" />
    </DialogContent>
    <DialogActions>
      <Button
        variant="outlined"
        color="error"
        endIcon={<ClearIcon />}
        onClick={() => {
          setShowModal(false);
        }}
      >
        CLOSE
      </Button>
    </DialogActions>
  </Dialog>
);

export default ShowDocumentPreviewModal;
