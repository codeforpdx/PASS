// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * Represents a home section component
 *
 * @memberof Home
 * @name HomeSection
 * @param {object} Props - the component props
 * @param {string} Props.componentImageSrc - image src
 * @param {string} Props.componentImageAlt - image alt
 * @param {string} Props.title - section title
 * @param {string} Props.description - section description
 * @param {string} Props.button - section button
 * @param {string} Props.href - section button href
 * @param {string} Props.label - section button aria-label
 * @param {boolean} Props.hasMargin - gives marginBottom
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
  hasMargin
}) => (
  <Stack mb={hasMargin ? 8 : null} alignItems="center">
    <Box
      component="img"
      src={componentImageSrc}
      alt={componentImageAlt}
      sx={{
        width: '300px'
      }}
    />
    <Typography
      variant="h2"
      mb="24px"
      sx={{
        color: 'primary.main',
        fontSize: '28px'
      }}
    >
      <strong>{title}</strong>
    </Typography>
    {description && (
      <Typography
        data-testid="testDescription"
        sx={{
          color: 'primary.strong',
          width: '100%',
          marginBottom: '24px'
        }}
      >
        {description}
      </Typography>
    )}
    {button && (
      <Button
        variant="contained"
        href={href}
        aria-label={label}
        sx={{
          my: '1rem',
          backgroundColor: 'primary.main'
        }}
      >
        {button}
      </Button>
    )}
  </Stack>
);

export default HomeSection;
