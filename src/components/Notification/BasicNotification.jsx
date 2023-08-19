import React, { useRef, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import useNotification from '@hooks/useNotification';

const TransitionUp = (props) => <Slide {...props} direction="up" />;

const BasicNotification = ({ severity, message, id, 'data-testid': dataTestId }) => {
  const [open, setOpen] = useState(false);
  const { remove } = useNotification();

  const timerID = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDismiss = () => {
    remove(id);
  };

  useEffect(() => {
    timerID.current = setTimeout(() => {
      handleDismiss();
      setOpen(false);
    }, 8000);

    if (message !== null) {
      setOpen(true);
    }

    return () => {
      clearTimeout(timerID.current);
    };
  }, []);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      id={id}
      data-testid={dataTestId}
      TransitionComponent={TransitionUp}
      autoHideDuration={6000}
    >
      <Alert severity={severity} variant="filled" elevation={6} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BasicNotification;
