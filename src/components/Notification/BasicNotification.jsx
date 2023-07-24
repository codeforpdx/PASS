import React, { forwardRef, useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const BasicNotification = ({ severity, message }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message !== '') {
      setOpen(true);
    }
  }, [message]);

  return (
    <Snackbar open={open}>
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BasicNotification;
