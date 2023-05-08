import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import ButtonGroup from '@mui/material/ButtonGroup';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

/**
 * AppHeader Component - Component that generates AppHeader section for PASS
 *
 * @memberof GlobalComponents
 * @name AppHeader
 */

const AppHeader = () => {
  const { session } = useSession();

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            {session.info.isLoggedIn ? (
              <>
                <Typography variant="h4" noWrap component="div">
                  PASS
                </Typography>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                  color="tertiary"
                  sx={{ margin: '0 0 0 20px' }}
                >
                  <Link to="/PASS/home/">
                    <Button>Home</Button>
                  </Link>
                  <Link to="/PASS/forms/">
                    <Button>Forms</Button>
                  </Link>
                </ButtonGroup>
              </>
            ) : (
              <Typography variant="h4" noWrap component="div">
                Getting started with PASS
              </Typography>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default AppHeader;
