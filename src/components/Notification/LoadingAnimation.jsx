// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/**
 * @typedef {import("../../typedefs.js").loadingAnimationProps} loadingAnimationProps
 */

/**
 * LoadingAnimation Component - Displays a div containing title of what is being
 * loaded and an animated loading progress bar. Must pass loadingItem attribute
 * as a string of the "title" of what is being loaded.
 *
 * @memberof Notification
 * @name LoadingAnimation
 * @param {loadingAnimationProps} Props - Component props for LoadingAnimation
 * @returns {React.ReactElement} a div of what is currently loading
 */
const LoadingAnimation = ({ loadingItem, animationType = 'linear' }) => (
  <Box
    sx={{
      my: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px'
    }}
  >
    <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
      <Typography variant="h5" component="h2" mb={2} align="center">
        Loading {loadingItem}...
      </Typography>
      {animationType === 'linear' ? <LinearProgress /> : <CircularProgress />}
    </Paper>
  </Box>
);

export default LoadingAnimation;
