// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
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
  <Container>
    <Box
      sx={{
        marginTop: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={2}
        sx={{ display: 'inline-block', mx: '2px', padding: '20px', minWidth: '300px' }}
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
      </Paper>
    </Box>
  </Container>
);

export default FormSection;
