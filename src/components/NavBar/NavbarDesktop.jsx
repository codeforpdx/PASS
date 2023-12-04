// React Imports
import React, { useContext, useEffect, useState } from 'react';
// React Router Imports
import { Link, NavLink } from 'react-router-dom';
// Material UI Imports
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
// Custom Hook Imports
import { useMessageList } from '@hooks';
// Component Imports
import { SignedInUserContext } from '@contexts';
import NavbarLinks from './NavbarLinks';
import NavMenu from './NavMenu';

/**
 * NavbarDesktop Component - Component that generates Navbar section for PASS
 * when a user is logged in on larger than mobile screen device
 *
 * @memberof NavBar
 * @name NavbarDesktop
 * @param {object} Props - The props for NavbarDesktop Component
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowConfirmation
 * - The set function for showConfirmationModal
 * @returns {React.JSX.Element} - The Desktop version of Navbar Component
 */
const NavbarDesktop = ({ setShowConfirmation }) => {
  const theme = useTheme();
  const { data } = useMessageList('Inbox');

  const numUnreadMessages = data?.reduce((a, m) => (!m.readStatus ? a + 1 : a), 0);

  // states for NavMenu component
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuId = 'primary-search-account-menu';

  const handleNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
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
          <NavbarLinks aria-label="navigation links" />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} role="group">
            {/* messages icon */}
            <IconButton
              component={NavLink}
              size="large"
              aria-label="Show messages"
              edge="start"
              color="inherit"
              to="/messages"
              sx={{ marginRight: '10px' }}
            >
              <Badge badgeContent={numUnreadMessages} color="error">
                <EmailIcon />
              </Badge>
            </IconButton>
            {/* notifications icon */}
            <IconButton
              size="large"
              aria-label="Show notifications"
              color="inherit"
              onClick={handleNotificationsMenu}
              edge="start"
            >
              <Badge color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {/* notifications menu */}
            <Menu
              id="menu-appbar-notifications"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleNotificationsClose}
              slotProps={{
                paper: {
                  style: {
                    marginTop: '10px'
                  }
                }
              }}
              sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <MenuItem onClick={handleNotificationsClose}>
                <p style={{ color: theme.palette.primary.main }}>Notification 1</p>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <p style={{ color: theme.palette.primary.main }}>Notification 2</p>
              </MenuItem>
            </Menu>
            {/* profile icon */}
            <IconButton
              size="large"
              edge="end"
              aria-label="Account of current user"
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

export default NavbarDesktop;
