// React Imports
import React from 'react';
import { Link } from 'react-router-dom';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

/**
 * NavBar Component - Component that generates NavBar section for PASS
 *
 * @memberof GlobalComponents
 * @name NavBar
 */

const NavBar = () => {
  const { session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(false);

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
                <Link to="/PASS/home/">
                  <Button
                    variant="contained"
                    aria-label="outlined primary button group"
                    color="tertiary"
                  >
                    Home
                  </Button>
                </Link>
                <Link to="/PASS/forms/">
                  <Button
                    variant="contained"
                    aria-label="outlined primary button group"
                    color="tertiary"
                  >
                    Forms
                  </Button>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={handleNotificationsMenu}
                >
                  <Badge badgeContent={17} color="error">
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
                >
                  <MenuItem onClick={handleNotificationsClose}>
                    <p>Notification 1</p>
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    <p>Notification 2</p>
                  </MenuItem>
                </Menu>
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
    </Box>
  );
};

export default NavBar;
