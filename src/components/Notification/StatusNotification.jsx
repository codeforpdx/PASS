// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Component Imports
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
  <Box>
    <Typography
      sx={{
        marginTop: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {statusType}:
    </Typography>
    {notification ? (
      <StatusMessage notification={notification} locationUrl={locationUrl} />
    ) : (
      <Typography
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {defaultMessage}
      </Typography>
    )}
  </Box>
);

export default StatusNotification;
