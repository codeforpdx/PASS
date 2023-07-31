import React, { useRef, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNotification } from '../../hooks/useNotification';

const BasicNotification = ({ severity, message, id }) => {
  const notify = useNotification();

  const timerID = useRef(null);

  const handleDismiss = () => {
    notify.remove(id);
  };

  useEffect(() => {
    timerID.current = setTimeout(() => {
      handleDismiss();
    }, 8000);

    return () => {
      clearTimeout(timerID.current);
    };
  }, []);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar id={id}>
        <Alert severity={severity} variant="filled" elevation={6} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default BasicNotification;
