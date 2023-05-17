// React Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Solid Imports
import { useSession, LoginButton } from '@inrupt/solid-ui-react';
// Material UI Imports
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// Custom Component Imports
import { LogoutModal } from '../LogoutModal';
import NavMenu from './NavMenu';
import NavMenuMobile from './NavMenuMobile';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';
import { useRedirectUrl } from '../../hooks';

/**
 * NavBar Component - Component that generates NavBar section for PASS
 *
 * @memberof GlobalComponents
 * @name NavBar
 */

const NavBar = () => {
  const { session } = useSession();
  const redirectUrl = useRedirectUrl();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMobile, setAnchorElMobile] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [tabValue, setTabValue] = useState('home');
  // state for LogoutModal popup
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

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

  const handleOpenMobileMenu = (event) => {
    setAnchorElMobile(event.currentTarget);
    setOpenMobileMenu(true);
  };

  // Event handler for logging out of SOLID POD and removing items from localStorage
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('redirectUrl');
    localStorage.removeItem('restorePath');
    localStorage.removeItem(`issuerConfig:${SOLID_IDENTITY_PROVIDER}`);
    localStorage.removeItem(`issuerConfig:${SOLID_IDENTITY_PROVIDER.slice(0, -1)}`);
    setShowConfirmation(false);
  };


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar sx={{ minHeight: '64px' }}>
            <Typography variant="h4" noWrap component="div" mr="10px">
              PASS
            </Typography>
            {session.info.isLoggedIn ? (
              <>
                <Box>
                  <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    textColor="inherit"
                    aria-label="tabs"
                  >
                    <Tab value="home" label="Home" component={Link} to="/PASS/home/" />
                    <Tab value="forms" label="Forms" component={Link} to="/PASS/forms/" />
                    <Tab value="inbox" label="Inbox" component={Link} to="/PASS/inbox/" />
                  </Tabs>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <IconButton
                    size="large"
                    aria-label="show new notifications"
                    color="inherit"
                    onClick={handleNotificationsMenu}
                    edge="start"
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
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleOpenMobileMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ flexGrow: 1 }} />
                <LoginButton oidcIssuer={SOLID_IDENTITY_PROVIDER} redirectUrl={redirectUrl}>
                  <Button variant="contained" type="submit" color="secondary" size="large">
                    Login
                  </Button>
                </LoginButton>
              </>
            )}
          </Toolbar>
        </AppBar>
        {openMobileMenu && (
          <NavMenuMobile
            mobileMenuId={mobileMenuId}
            openMobileMenu={openMobileMenu}
            setOpenMobileMenu={setOpenMobileMenu}
            anchorElMobile={anchorElMobile}
            setAnchorElMobile={setAnchorElMobile}
            setShowConfirmation={setShowConfirmation}
          />
        )}
        {openMenu && (
          <NavMenu
            menuId={menuId}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            setShowConfirmation={setShowConfirmation}
          />
        )}
      </Box>
      {/* modal/popup renders when showConfirmation state is true */}
      <LogoutModal
      showConfirmation={showConfirmation}
      setShowConfirmation={setShowConfirmation}
      handleLogout={handleLogout}
      />
    </>
  );
};

export default NavBar;
