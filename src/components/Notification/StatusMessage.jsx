// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
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

const StatusMessage = ({ notification, locationUrl, filename }) => {
  if (locationUrl) {
    return (
      <Typography sx={{ fontWeight: 'bold' }}>
        {notification}
        <a href={locationUrl} target="_blank" rel="noreferrer">
          Click here.
        </a>
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography sx={{ fontWeight: 'bold' }}>{notification}</Typography>
      {filename && (
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxWidth: '300px',
            textOverflow: 'ellipsis',
            fontWeight: 'normal'
          }}
        >
          File: {filename}
        </Typography>
      )}
      {/* <br />
      <CircularProgress /> */}
    </Box>
  );
};

export default StatusMessage;
