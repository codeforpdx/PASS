import React, { useRef, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useNotification from '@hooks/useNotification';

const BasicNotification = ({ severity, message, id, 'data-testid': dataTestId }) => {
  const [open, setOpen] = useState(false);

  const { remove } = useNotification();

  const timerID = useRef(null);

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
    <Snackbar open={open} id={id} data-testid={dataTestId} autoHideDuration={6000}>
      <Alert severity={severity} variant="filled" elevation={6} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BasicNotification;
