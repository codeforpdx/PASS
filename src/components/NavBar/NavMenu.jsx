// React Imports
import React from 'react';
import { NavLink } from 'react-router-dom';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';

/**
 * NavMenu Component - Component that generates NavMenu section for PASS
 *
 * @memberof GlobalComponents
 * @name NavMenu
 */

const NavMenu = ({
  menuId,
  openMenu,
  setOpenMenu,
  anchorEl,
  setAnchorEl,
  setShowConfirmation,
  profileImg
}) => {
  const theme = useTheme();

  const handleMenuClose = () => {
    setOpenMenu(false);
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={openMenu}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      sx={{ mt: 5, backgroundColor: 'rgba(1, 121, 105, 0.2)' }}
    >
      <MenuList>
        {/* messages */}
        <MenuItem
          component={Button}
          startIcon={<EmailIcon />}
          sx={{ display: { md: 'none' }, color: theme.palette.primary.main, width: '100%' }}
        >
          <NavLink
            to="/PASS/Messages"
            style={{ textDecoration: 'none', color: theme.palette.primary.main }}
          >
            Messages
          </NavLink>
        </MenuItem>
        {/* notifications */}
        <MenuItem
          component={Button}
          startIcon={<NotificationsIcon />}
          sx={{ display: { md: 'none' }, color: theme.palette.primary.main, width: '100%' }}
        >
          Notifications
        </MenuItem>
        {/* profile */}
        <MenuItem
          component={Button}
          sx={{ width: '100%' }}
          startIcon={
            <Avatar
              src={profileImg}
              alt="PASS profile"
              sx={{
                height: '24px',
                width: '24px',
                objectFit: 'contain',
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.primary.main
              }}
            />
          }
        >
          <NavLink
            to="/PASS/profile"
            style={{ textDecoration: 'none', color: theme.palette.primary.main }}
          >
            Profile
          </NavLink>
        </MenuItem>
        <Divider />
        {/* settings */}
        <MenuItem
          component={Button}
          startIcon={<SettingsIcon />}
          sx={{ color: theme.palette.primary.main, width: '100%' }}
        >
          Settings
        </MenuItem>
        {/* logout */}
        <MenuItem
          component={Button}
          startIcon={<LogoutIcon />}
          onClick={() => setShowConfirmation(true)}
          sx={{ color: theme.palette.error.main, width: '100%' }}
        >
          Log Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavMenu;
