// React Imports
import React, { useState } from 'react';

// MUI theme
import theme from '../../theme';

/**
 * NavBarSkipLink component is an accessibility component
 * that allows users to skip to the main content of the page.
 *
 * @returns {React.Element} The rendered NavBarSkipLink component.
 */
const NavBarSkipLink = () => {
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

  // handles clicking on link
  const handleClick = () => {
    setAnimateOut(true);
    const targetElement = document.getElementById('main-content');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      style={{
        position: 'absolute',
        top: 0,
        left: 100,
        zIndex: 999,
        transition: 'all 0.3s ease-in-out',
        opacity: animateOut ? 0 : 1,
        transform: animateOut ? 'translateY(-100%)' : 'translateY(0%)',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        textDecoration: 'underline',
        border: 'none'
      }}
    >
      Skip to main content
    </a>
  );
};

export default NavBarSkipLink;
