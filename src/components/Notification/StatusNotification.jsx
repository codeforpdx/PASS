import React from 'react';
import StatusMessage from './StatusMessage';

/**
 * StatusNotification Component - Component that renders status notification and message
 * for file upload, search, delete, etc.
 * @memberof Notifications
 * @component
 * @name StatusNotification
 * @param {object}
 * @property {string} notification - File status message
 * @property {string} statusType - Type of file status (i.e. file upload, file fetch, file delete)
 * @property {string} defaultMessage - Default message when status is not triggered
 * @property {string} [locationUrl] - URL location of file, if exist
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
