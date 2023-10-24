// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * FormSection Component - Component that wraps section with title and MUI Box
 * component
 *
 * @memberof Forms
 * @name FormSection
 * @param {object} Props - A React prop that consists of
 * that consist of title and children (see {@link formSectionProps})
 * @param {string} Props.title - Title of form section
 * @param {React.ReactElement} Props.children - JSX Element of the wrapped form
 * @returns {React.JSX.Element} - The FormSection Component
 */
const FormSection = ({ title, children }) => (
  <Box
    sx={{
      marginTop: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      mx: '3px',
      padding: '20px',
      minWidth: '50%'
    }}
  >
    <Typography
      align="center"
      mb={2}
      variant="h5"
      sx={{
        maxWidth: '500px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

export default FormSection;
