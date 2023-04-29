import React, { useContext } from 'react';
import { LogoutButton } from '@inrupt/solid-ui-react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { RouterContext } from '../../contexts';
import theme from '../../theme';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { currentUrl } = useContext(RouterContext);

  const handleLogout = () => {
    window.location.href = `${currentUrl.split('PASS')[0]}PASS/`;
  };

  return (
    <ThemeProvider theme={theme}>
      <section className="navLogin" style={{ display: 'flex', gap: '20px' }}>
        <LogoutButton onLogout={handleLogout} />
      </section>
    </ThemeProvider>
  );
};

export default Logout;
