import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AppHeader Component - Component that generates AppHeader section for PASS
 *
 * @memberof GlobalComponents
 * @name AppHeader
 */

const AppHeader = ({ isLoggedIn }) => {
  const headerStyle = {
    width: '100%',
    gap: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContents: 'center'
  };

  return (
    <header style={headerStyle}>
      <h2>Getting Started with PASS</h2>
      {isLoggedIn ? (
        <>
          <Link to="/PASS/home/">Home</Link>
          <Link to="/PASS/forms/">Forms</Link>
        </>
      ) : null}
    </header>
  );
};

export default AppHeader;
