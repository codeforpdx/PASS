// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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
 * @returns {React.JSX.Element} the KeyFeatures section component
 */
const KeyFeatures = ({ icon, title, description }) => (
  <Stack alignItems="center">
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '14px',
        color: 'primary.main'
      }}
    >
      {icon}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          color: 'primary.main',
          textAlign: 'center'
        }}
      >
        <strong>{title}</strong>
      </Typography>
    </Box>
    <Typography
      variant="body1"
      sx={{
        textAlign: 'center',
        color: 'primary.dark',
        marginBottom: '50px'
      }}
    >
      {description}
    </Typography>
  </Stack>
);

export default KeyFeatures;
