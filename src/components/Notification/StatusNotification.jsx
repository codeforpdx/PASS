import React from 'react';
import StatusMessage from './StatusMessage';

/**
 * @typedef {Object} statusNotificationProps
 * @property {String} notification - File status message
 * @property {String} statusType - Type of file status (i.e. file upload, file fetch, file delete)
 * @property {String} defaultMessage - Default message when status is not triggered
 * @property {String} [locationUrl] - URL location of file, if exist
 */

/**
 * StatusNotification Component - Component that renders status notification and message
 * for file upload, search, delete, etc.
 * @memberof Notifications
 * @component
 * @name StatusNotification
 * @param {statusNotificationProps} statusNotificationProps - A react prop that consist of notification,
 * statusType, defaultMessage, and locationUrl, which is optional
 */

const StatusNotification = ({ notification, statusType, defaultMessage, locationUrl = '' }) => (
  <dl className="display">
    <dt>{statusType}:</dt>
    {notification ? (
      <StatusMessage notification={notification} locationUrl={locationUrl} />
    ) : (
      <dd>{defaultMessage}</dd>
    )}
  </dl>
);

export default StatusNotification;
