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

const StatusNotification = ({ state, statusType, defaultMessage, file }) => (
  <Box
    sx={{
      marginTop: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Typography>{statusType}:</Typography>
    {state.message ? (
      <StatusMessage
        notification={state.message}
        locationUrl={state.documentUrl}
        filename={file?.name}
      />
    ) : (
      <Typography>{defaultMessage}</Typography>
    )}
  </Box>
);

export default StatusNotification;
