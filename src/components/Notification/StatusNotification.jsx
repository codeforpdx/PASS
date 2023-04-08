import React from 'react';
import StatusMessage from './StatusMessage';

/**
 * @typedef {import("../../typedefs").statusNotificationProps} statusNotificationProps
 */

/**
 * StatusNotification Component - Component that renders status notification and
 * message for file upload, search, delete, etc.
 *
 * @memberof Notifications
 * @name StatusNotification
 * @param {statusNotificationProps} statusNotificationProps - A react prop that
 * consist of notification, statusType, defaultMessage, and locationUrl, which
 * is optional (see {@link statusNotificationProps})
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
