// React Imports
import React from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
// Utility Imports
import { getBlobFromSolid } from '../../utils';

/**
 * ShowDocumentsModal Component - Popup modal that shows client documents if gotten
 * explicit permission via ACL
 *
 * @memberof DocumentModals
 * @name ShowDocumentsModal
 */

const ShowDocumentsModal = ({ showModal, setShowModal, fileSrc }) => {
  const { session } = useSession();

  const handleShowDocumentLocal = async (fileUrl) => {
    const urlFileBlob = await getBlobFromSolid(session, fileUrl);
    window.open(urlFileBlob);
  };

  return (
    <Dialog open={showModal} aria-labelledby="dialog-title" onClose={() => setShowModal(false)}>
      <DialogTitle id="dialog-tile" sx={{ fontWeight: 'bold' }}>
        {fileSrc.documentType}
      </DialogTitle>

      <DialogContent>
        <Box key={fileSrc.documentUrl}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: { xxs: '150px', xs: '200px', sm: '300px' },
                textOverflow: 'ellipsis'
              }}
            >
              File name: {fileSrc.filename}
            </Typography>
            <Typography>Upload date: {fileSrc.uploadDate.toLocaleString()}</Typography>
            <Typography>Description: {fileSrc.description}</Typography>
            <Typography>Expire Date: {fileSrc.expireDate}</Typography>
            <br />
          </Box>
        </Box>
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
        <Button
          variant="contained"
          type="button"
          endIcon={<CheckIcon />}
          onClick={() => handleShowDocumentLocal(fileSrc.documentUrl)}
          sx={{ width: '100px' }}
        >
          OPEN
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowDocumentsModal;
