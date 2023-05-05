import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import theme from '../../theme';

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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Getting Started with PASS
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
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
