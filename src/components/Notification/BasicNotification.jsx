// React Imports
import React, { useRef, useEffect, useState } from 'react';
// Material UI Imports
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
// Custom Hook Imports
import useNotification from '@hooks/useNotification';

const TransitionUp = (props) => <Slide {...props} direction="up" />;

/**
 *
 * @param {object} Props - The props for BasicNotification Component
 * @param {string} Props.severity - The severity level of the notification
 * @param {string} Props.message - The notification message
 * @param {number} Props.id - The unique setTimeout ID
 * @returns {React.JSX.Element} - The BasicNotification Component
 */
const BasicNotification = ({ severity, message, id }) => {
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
