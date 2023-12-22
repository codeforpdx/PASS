// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/**
 * FormSection Component - Component that wraps section with title and MUI Box
 * component
 *
 * @memberof Forms
 * @name FormSection
 * @param {object} Props - A React prop that consists of
 * that consist of title and children (see {@link formSectionProps})
 * @param {string} Props.headingId - The `id` attribute of the element containing the `title`
 * @param {string} Props.title - Title of form section
 * @param {React.ReactElement} Props.children - JSX Element of the wrapped form
 * @returns {React.JSX.Element} - The FormSection Component
 */
const FormSection = ({ title, headingId, children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        marginTop: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mx: '3px',
        padding: isSmallScreen ? '10px' : '20px',
        minWidth: '50%'
      }}
    >
      <Typography variant="h2" align="center" mb={2} sx={{ fontSize: '20px' }} id={headingId}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default FormSection;
