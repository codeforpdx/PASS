import React from 'react';
import BasicNotification from './BasicNotification';

/**
 * NotificationContainer - Component is a component that renders and contains
 * the MUI snackbar when a notification is being displayed
 *
 * @memberof Notification
 * @name NotificationContainer
 * @param {object} Props - The Props for NotificationContainer Component
 * @param {object} Props.notifications - An object containing information about
 * the notification in question
 * @returns {React.JSX.Element} The NotificationContainer Component
 */
const NotificationContainer = ({ notifications }) => (
  <div>
    {notifications.map((notification) => (
      <BasicNotification
        key={notification.id}
        id={notification.id}
        message={notification.message}
        severity={notification.severity}
      />
    ))}
  </div>
);

export default NotificationContainer;
