// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Component Imports
import { StatusNotification } from '../Notification';

/**
 * @typedef {import('../../typedefs').formSectionProps} formSectionProps
 */

/**
 * FormSection Component - Component that wraps Form with StatusNotification
 *
 * @memberof Forms
 * @name FormSection
 * @param {formSectionProps} formSectionProps - A react prop that consists of
 * that consist of title, state, statusType, defaultMessage, and children (see
 * {@link formSectionProps})
 */

const FormSection = ({ title, state, statusType, defaultMessage, children }) => (
  <Box
    sx={{
      marginTop: 1,
      display: 'inline-block',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      mx: '3px',
      padding: '20px',
      minWidth: '50%',
      boxShadow: 2
    }}
  >
    <Typography
      display="flex"
      justifyContent="center"
      alignItems="center"
      mb={2}
      variant="h5"
      component="h3"
    >
      {title}
    </Typography>
    {children}
    <StatusNotification state={state} statusType={statusType} defaultMessage={defaultMessage} />
  </Box>
);

export default FormSection;
