// React Imports
import React, { useContext, useEffect, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@hooks';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// Component Imports
import LogoutModal from '../Modals/LogoutModal';
import NavbarLinks from './NavbarLinks';
import NavMenu from './NavMenu';
import OidcLoginComponent from './OidcLoginComponent';
import { SignedInUserContext } from '../../contexts';

/**
 * NavBar Component - Component that generates NavBar section for PASS
 *
 * @memberof GlobalComponents
 * @name NavBar
 */

const NavBar = () => {
  const theme = useTheme();
  const { session } = useSession();

  // states for NavMenu component
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuId = 'primary-search-account-menu';

  // state for LogoutModal component
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

  // Event handler for logging out of SOLID POD and removing items from localStorage
  const handleLogout = () => {
    localStorage.clear();
    setShowConfirmationModal(false);
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
          <Typography variant="h4" noWrap component="div" mr="10px">
            PASS
          </Typography>
          {session.info.isLoggedIn ? (
            <>
              <Box>
                <NavbarLinks />
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
                  sx={{ marginTop: '40px', backgroundColor: 'rgba(1, 121, 105, 0.2)' }}
                >
                  <MenuItem onClick={handleNotificationsClose}>
                    <p style={{ color: theme.palette.primary.main }}>Notification 1</p>
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    <p style={{ color: theme.palette.primary.main }}>Notification 2</p>
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
                  <Avatar
                    src={profileImg}
                    alt="PASS profile"
                    sx={{ height: '24px', width: '24px', objectFit: 'contain' }}
                  />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleOpenMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              {openMenu && (
                <NavMenu
                  menuId={menuId}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  setShowConfirmation={setShowConfirmationModal}
                  profileImg={profileImg}
                />
              )}
              {/* modal/popup renders when showConfirmationModal state is true */}
              <LogoutModal
                showConfirmation={showConfirmationModal}
                setShowConfirmation={setShowConfirmationModal}
                handleLogout={handleLogout}
              />
            </>
          ) : (
            <OidcLoginComponent />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
