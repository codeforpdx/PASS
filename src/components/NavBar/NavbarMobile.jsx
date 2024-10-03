// React Imports
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import NavbarLinks from './NavbarLinks';
import NavMenu from './NavMenu';
import { SignedInUserContext } from '../../contexts';

/**
 * NavbarMobile Component - Component that generates Navbar section for PASS
 * when a user is logged in on a mobile screen device
 *
 * @memberof NavBar
 * @name NavbarMobile
 * @param {object} Props - The props for NavbarMobile Component
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowConfirmation
 * - The set function for showConfirmationModal
 * @returns {React.JSX.Element} The Mobile version of the Navbar Component
 */
const NavbarMobile = ({ setShowConfirmation }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
            <img src="/pass-logo.png" alt="PASS logo" style={{ marginRight: '2rem' }} />
          </Link>
          {!isSmallScreen && <NavbarLinks aria-label="navigation links" />}
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
          {/* Notifications menu */}
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
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavbarMobile;
