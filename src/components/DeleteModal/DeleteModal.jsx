import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

const DeleteModal = ({showDeleteModal,setShowDeleteModal,client,handleDelete}) => (
    <Dialog
    open={showDeleteModal}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    onClose={() => setShowDeleteModal(false)}
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
        onClick={() => setShowDeleteModal(false)}
      >
        NO
      </Button>

        <Button
          variant="outlined"
          color="success"
          endIcon={<CheckIcon />}
          sx={{ marginLeft: '1rem' }}
          onClick={handleDelete}
        >
          YES
        </Button>
      
    </DialogActions>

  </Dialog>

  
  )


export default DeleteModal
