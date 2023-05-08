import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {session.info.isLoggedIn ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
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
              <Box sx={{ flexGrow: 1 }} />
              <IconButton size="large" color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </>
          ) : (
            <Typography variant="h4" noWrap component="div">
              Getting started with PASS
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppHeader;
