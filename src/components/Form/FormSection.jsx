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
  // eslint-disable-next-line no-unused-vars
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        minWidth: '50%',
        // maxWidth: isSmallScreen ? '100dvw' : '75dvw',
        width: '100%'
      }}
    >
      <Typography
        variant="h2"
        align="center"
        mb={1}
        sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          // maxWidth: '400px',
          width: isSmallScreen ? '100dvw' : '50dvw',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        id={headingId}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default FormSection;
