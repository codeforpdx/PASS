// React Imports
import React from 'react';
// Material UI Imports
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

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
      <Typography variant="dd">
        {notification}
        <a href={locationUrl} target="_blank" rel="noreferrer">
          {locationUrl}
        </a>
      </Typography>
    );
  }

  return (
    <Typography>
      {notification}
      <br />
      <CircularProgress />
    </Typography>
  );
};

export default StatusMessage;
