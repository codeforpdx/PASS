// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
// Component Imports
import NavbarLinks from './NavbarLinks';
import NavMenu from './NavMenu';
import { SignedInUserContext } from '../../contexts';

/**
 * NavbarMobile Component - Component that generates Navbar section for PASS
 * when a user is logged in on a mobile screen device
 *
 *
 * @memberof GlobalComponents
 * @name NavbarLoggedOut
 */

const NavbarMobile = ({ setShowConfirmation }) => {
  const theme = useTheme();

  // states for NavMenu component
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

  const { profileData } = useContext(SignedInUserContext);
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImage'));

  useEffect(() => {
    setProfileImg(localStorage.getItem('profileImage'));
  }, [profileData]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ minHeight: '64px' }}>
          <Link to="/" aria-label="Home">
            <img src="/pass-logo.png" alt="CODE PDX logo" style={{ marginRight: '2rem' }} />
          </Link>
          <NavbarLinks aria-label="navigation links" />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            aria-label="mobile menu"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleOpenMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          {/* notifications menu */}
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
            sx={{ marginTop: '40px', backgroundColor: 'rgba(1, 121, 105, 0.2)' }}
          >
            <MenuItem onClick={handleNotificationsClose}>
              <p style={{ color: theme.palette.primary.main }}>Notification 1</p>
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose}>
              <p style={{ color: theme.palette.primary.main }}>Notification 2</p>
            </MenuItem>
          </Menu>

          {openMenu && (
            <NavMenu
              menuId={menuId}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              setShowConfirmation={setShowConfirmation}
              handleNotificationsMenu={handleNotificationsMenu}
              profileImg={profileImg}
            />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavbarMobile;
