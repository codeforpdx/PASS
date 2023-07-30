import React, { useRef, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNotification } from '../../hooks/useNotification';

const BasicNotification = ({ severity, message, id }) => {
  // const [open, setOpen] = useState(false);
  const notify = useNotification()
  console.log(id, 'id of this component')
  const timerID = useRef(null)
  // useEffect(() => {
  //   if (message !== '') {
  //     setOpen(true);
  //   }
  // }, [message]);

  const handleDismiss = () => {
    notify.remove(id)
    console.log(id, 'id to be deleted')
  }

  useEffect(() => {
    timerID.current = setTimeout(() => {
      handleDismiss()
    }, 8000)

    return () => {
      clearTimeout(timerID.current)
    }
  },[])

  return (
    <Snackbar open={open} id={id}>
      <Alert severity={severity} variant="filled" elevation={6} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BasicNotification;
