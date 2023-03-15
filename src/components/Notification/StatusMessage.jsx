import React from 'react';

/**
 * StatusMessage Component - Sub-component that shows status message for StatusNotification
 * @memberof Notifications
 * @component
 * @name StatusMessage
 * @param {object}
 * @property {string} notification - File status message
 * @property {string} [locationUrl] - URL location of file, if exist
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
