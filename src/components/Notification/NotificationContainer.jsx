import BasicNotification from './BasicNotification';

const NotificationContainer = ({ notifications }) => (
  <>
    {notifications.map((notification) => (
      <BasicNotification
        key={notification.id}
        id={notification.id}
        message={notification.message}
        severity={notification.severity}
      />
    ))}
  </>
);

export default NotificationContainer;
