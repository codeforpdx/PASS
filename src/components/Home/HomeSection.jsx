// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
/**
 * @typedef {object} HomeSectionParams
 * @property {string} componentImageSrc - image src
 * @property {string} componentImageAlt - image alt
 * @property {string} title - section title
 * @property {string} description - section description
 * @property {string} button - section button
 * @property {string} href - section button href
 * @property {string} label - section button aria-label
 * @property {boolean} isReallySmallScreen - screen size
 */
/**
 * Represents a home section component
 *
 *  @memberof Home
 * @name HomeSecton
 * @param {HomeSectionParams} props - the component props
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
