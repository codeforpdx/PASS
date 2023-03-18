import React from 'react';

/**
 * @typedef {Object} statusMessageProps
 * @property {String} notification - File status message
 * @property {String} [locationUrl] - URL location of file, if exist
 */

/**
 * StatusMessage Component - Sub-component that shows status message for StatusNotification
 * @memberof Notifications
 * @component
 * @name StatusMessage
 * @param {statusMessageProps} statusMessageProps - A react prop that consist of notification,
 * and locationUrl, which is optional
 */

const StatusMessage = ({ notification, locationUrl }) => {
  if (notification) {
    return (
      <dd className="labelStatus" role="alert">
        {notification}{' '}
        <a href={locationUrl} target="_blank" rel="noreferrer">
          {locationUrl}
        </a>
      </dd>
    );
  }

  return (
    <dd className="labelStatus" role="alert">
      {notification}
    </dd>
  );
};

export default StatusMessage;
