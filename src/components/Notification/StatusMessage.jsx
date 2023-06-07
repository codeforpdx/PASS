// React Imports
import React from 'react';

/**
 * @typedef {import('../../typedefs').statusMessageProps} statusMessageProps
 */

/**
 * StatusMessage Component - Sub-component that shows status message for
 * StatusNotification
 *
 * @memberof Notifications
 * @name StatusMessage
 * @param {statusMessageProps} statusMessageProps - A react prop that consist of
 * notification and locationUrl, which is optional (see {@link statusMessageProps})
 */

const StatusMessage = ({ notification, locationUrl }) => {
  if (locationUrl) {
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
