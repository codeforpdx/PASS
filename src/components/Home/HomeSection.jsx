// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const HomeSection = (src, alt, title, description, button, href, label, isReallySmallScreen) => (
  <>
    <Box
      component="img"
      src={src}
      lt={alt}
      sx={{
        width: isReallySmallScreen ? 1 : 2 / 4
      }}
    />
    <Typography
      variant={isReallySmallScreen ? 'h3' : 'h2'}
      sx={{
        color: 'primary.main',
        textAlign: 'center',
        marginBottom: '24px'
      }}
    >
      <strong>{title}</strong>
    </Typography>
    <Typography
      variant={isReallySmallScreen ? 'h6' : 'h5'}
      sx={{
        color: 'primary.dark',
        width: isReallySmallScreen ? '100%' : '85%',
        marginBottom: '24px',
        textAlign: 'center'
      }}
    >
      {description}
    </Typography>
    {button && (
      <Button
        variant="contained"
        href={href}
        aria-label={label}
        sx={{
          my: '1rem',
          backgroundColor: 'primary.light',
          width: isReallySmallScreen ? 1 : 1 / 4,
          borderRadius: '25px'
        }}
      >
        {button}
      </Button>
    )}
  </>
);

export default HomeSection;
