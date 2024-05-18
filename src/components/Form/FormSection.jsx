// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Util Imports
import { truncateText } from '@utils';

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
 * @param {React.ReactElement} Props.children - The child elements to be rendered inside the main content area
 * @returns {React.JSX.Element} The FormSection Component
 */
const FormSection = ({ title, headingId, children }) => {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const truncatedText = title ? truncateText(title) : '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        // minWidth: '50vw',
        // minWidth: isSmallScreen ? null : '50dvw',
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
          // TODO: Discuss whether any widths (normal, max, and/or min) should be set
          // width: isSmallScreen ? '100dvw' : '50dvw',
          // whiteSpace: 'nowrap',
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
          maxWidth: '100%'
        }}
        id={headingId}
      >
        {truncatedText}
      </Typography>
      {children}
    </Box>
  );
};

export default FormSection;
