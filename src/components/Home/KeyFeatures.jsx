// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Represents key features section component
 *
 * @memberof Home
 * @name KeyFeatures
 * @param {object} Props - the props
 * @param {string} Props.icon - icon
 * @param {string} Props.title - key feature title
 * @param {string} Props.description - key feature description
 * @param {boolean} Props.isReallySmallScreen - screen size
 * @returns {React.JSX.Element} the KeyFeatures section component
 */
const KeyFeatures = ({ icon, title, description, isReallySmallScreen }) => (
  <>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
        color: 'primary.main'
      }}
    >
      {icon}
      <strong>{title}</strong>
    </Box>
    <Typography
      variant="body1"
      sx={{
        width: isReallySmallScreen ? 1 : '67%',
        textAlign: 'center',
        color: 'primary.dark',
        marginBottom: '50px'
      }}
    >
      {description}
    </Typography>
  </>
);

export default KeyFeatures;
