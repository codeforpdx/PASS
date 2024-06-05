// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * HomeSection - Generates a home section component
 *
 * @memberof Home
 * @name HomeSection
 * @param {object} Props - The component props
 * @param {string} Props.componentImageSrc - Image src
 * @param {string} Props.componentImageAlt - Image alt
 * @param {string} Props.title - Section title
 * @param {string} Props.description - Section description
 * @param {string} Props.button - Section button
 * @param {string} Props.href - Section button href
 * @param {string} Props.label - Section button aria-label
 * @param {boolean} Props.hasMargin - Gives marginBottom
 * @returns {React.JSX.Element} The Home Section component
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
        fontSize: '28px',
        fontWeight: 'bold'
      }}
    >
      {title}
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
