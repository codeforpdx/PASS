import Stack from '@mui/material/Stack';
import BasicNotification from './BasicNotification';

const NotificationContainer = ({ notifications }) => (
  <Stack spacing={4}>
    {notifications.map((notification) => (
      <BasicNotification
        key={notification.id}
        id={notification.id}
        message={notification.message}
        severity={notification.severity}
      />
    ))}
  </Stack>
);

export default NotificationContainer;
