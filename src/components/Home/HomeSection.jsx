// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

/**
 * Represents a home section component
 *
 * @memberof Home
 * @name HomeSecton
 * @param {object} Props - the component props
 * @param {string} Props.componentImageSrc - image src
 * @param {string} Props.componentImageAlt - image alt
 * @param {string} Props.title - section title
 * @param {string} Props.description - section description
 * @param {string} Props.button - section button
 * @param {string} Props.href - section button href
 * @param {string} Props.label - section button aria-label
 * @param {boolean} Props.isReallySmallScreen - screen size
 * @returns {React.JSX.Element} - the home section component
 */
const HomeSection = ({
  componentImageSrc,
  componentImageAlt,
  title,
  description,
  button,
  href,
  label,
  isReallySmallScreen
}) => (
  <>
    <Box
      component="img"
      src={componentImageSrc}
      alt={componentImageAlt}
      sx={{
        width: isReallySmallScreen ? '80%' : '300px'
      }}
    />
    <Typography
      variant="h2"
      sx={{
        color: 'primary.main',
        textAlign: 'center',
        marginBottom: '24px',
        fontSize: '28px'
      }}
    >
      <strong>{title}</strong>
    </Typography>
    <Typography
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
