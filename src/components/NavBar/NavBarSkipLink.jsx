// React Imports
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
// Material UI Imports
import Link from '@mui/material/Link';
// Theme Imports
import theme from '../../theme';

/**
 * NavBarSkipLink component is an accessibility component
 * that allows users to skip to the main content of the page.
 *
 * @returns {React.Element} The rendered NavBarSkipLink component.
 */
const NavBarSkipLink = () => {
  // react router location
  const location = useLocation();
  // state used for hiding and showing component
  const [animateOut, setAnimateOut] = useState(true);

  // when TAB key is pressed and bring link into focus
  const handleFocus = () => {
    setAnimateOut(false);
  };

  // handles blur on link
  const handleBlur = () => {
    setAnimateOut(true);
  };

  return (
    <Link
      component={HashLink}
      smooth
      onFocus={handleFocus}
      onBlur={handleBlur}
      to={{ pathname: location.pathname, hash: '#main-content' }}
      style={{
        position: 'absolute',
        top: 0,
        left: 100,
        zIndex: 999,
        transition: 'all 0.3s ease-in-out',
        background: theme.palette.background.main,
        color: theme.palette.primary.text,
        opacity: animateOut ? 0 : 1,
        padding: '5px',
        transform: animateOut ? 'translateY(-100%)' : 'translateY(0%)'
      }}
    >
      Skip to main content
    </Link>
  );
};

export default NavBarSkipLink;
