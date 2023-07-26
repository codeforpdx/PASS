// React Imports
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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
// Context Imports
import { DocumentListContext } from '@contexts';

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
  handleNotificationsMenu,
  profileImg
}) => {
  const theme = useTheme();
  const { setClient } = useContext(DocumentListContext);

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
          <Link
            to="/messages"
            style={{ textDecoration: 'none', color: theme.palette.primary.main }}
          >
            Messages
          </Link>
        </MenuItem>
        {/* notifications */}
        <MenuItem
          component={Button}
          startIcon={<NotificationsIcon />}
          onClick={handleNotificationsMenu}
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
          <Link
            to="/profile"
            state={{ client: null }}
            style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            onClick={() => setClient(null)}
          >
            Profile
          </Link>
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
