import React from 'react';
import BasicNotification from './BasicNotification';

const NotificationContainer = ({ notifications }) => (
  <div>
    {notifications.map((notification) => (
      <BasicNotification
        key={notification.id}
        id={notification.id}
        message={notification.message}
        severity={notification.severity}
        data-testid="noteTest"
      />
    ))}
  </div>
);

export default NotificationContainer;
