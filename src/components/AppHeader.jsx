import { useSession } from '@inrupt/solid-ui-react';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AppHeader Component - Component that generates AppHeader section for PASS
 *
 * @memberof GlobalComponents
 * @name AppHeader
 */

const AppHeader = () => {
  const { session } = useSession();

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
      {session.info.isLoggedIn ? (
        <>
          <Link to="/PASS/home/">Home</Link>
          <Link to="/PASS/forms/">Forms</Link>
        </>
      ) : null}
    </header>
  );
};

export default AppHeader;
