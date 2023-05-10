// React Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// Custom Component Imports
import NavMenu from './NavMenu';

/**
 * NavBar Component - Component that generates NavBar section for PASS
 *
 * @memberof GlobalComponents
 * @name NavBar
 */

const NavBar = () => {
  const { session } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const menuId = 'primary-search-account-menu';

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {session.info.isLoggedIn ? (
            <>
              <Typography variant="h4" noWrap component="div" mr="10px">
                PASS
              </Typography>
              <>
                <Typography
                  variant="h5"
                  noWrap
                  component="div"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    '& > *': {
                      m: 1
                    }
                  }}
                >
                  <Link to="/PASS/home/">Home</Link>
                  <Link to="/PASS/forms/">Forms</Link>
                </Typography>

                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="large"
                  aria-label="show new notifications"
                  color="inherit"
                  onClick={handleNotificationsMenu}
                >
                  <Badge color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  id="menu-appbar-notifications"
                  anchorEl={anchorElNotifications}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorElNotifications)}
                  onClose={handleNotificationsClose}
                  sx={{ marginTop: '40px' }}
                >
                  <MenuItem onClick={handleNotificationsClose}>
                    <p>Notification 1</p>
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    <p>Notification 2</p>
                  </MenuItem>
                </Menu>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleOpenMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="h4" noWrap component="div">
                Getting started with PASS
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}
        </Toolbar>
      </AppBar>
      {openMenu ? (
        <NavMenu
          menuId={menuId}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      ) : null}
    </Box>
  );
};

export default NavBar;
