// React Imports
import React from 'react';
// Material UI Imports
// import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

// TODO: Need to discuss when to trigger CircularProgress animation
// Add to in-progress responses but not in event of failure

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
          Click here.
        </a>
      </Typography>
    );
  }

  return (
    <Typography
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {notification}
      {/* <br />
      <CircularProgress /> */}
    </Typography>
  );
};

export default StatusMessage;
