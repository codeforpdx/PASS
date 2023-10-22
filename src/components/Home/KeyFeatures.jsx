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
        marginBottom: '14px',
        color: 'primary.main',
        width: isReallySmallScreen ? 1 : 'full'
      }}
    >
      {icon}
      <Typography
        variant={isReallySmallScreen ? 'h5' : 'h4'}
        sx={{
          marginLeft: '8px',
          textAlign: isReallySmallScreen ? 'start' : 'center',
          width: '100%'
        }}
      >
        <strong>{title}</strong>
      </Typography>
    </Box>
    <Typography
      variant="body1"
      sx={{
        width: isReallySmallScreen ? 1 : 2 / 3,
        textAlign: isReallySmallScreen ? 'start' : 'center',
        color: 'primary.dark',
        marginBottom: '50px'
      }}
    >
      {description}
    </Typography>
  </>
);

export default KeyFeatures;
