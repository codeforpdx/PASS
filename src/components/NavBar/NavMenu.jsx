// React Imports
import React from 'react';
import { NavLink } from 'react-router-dom';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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
  profileImageBlob
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
        <MenuItem sx={{ display: { md: 'none' } }}>
          <Button variant="text" startIcon={<NotificationsIcon />}>
            Notifications
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            variant="text"
            startIcon={
              <Avatar
                src={profileImageBlob}
                alt="PASS profile"
                sx={{ height: '24px', width: '24px', objectFit: 'contain' }}
              />
            }
          >
            <NavLink
              to="/PASS/profile"
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            >
              Profile
            </NavLink>
          </Button>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Button variant="text" startIcon={<SettingsIcon />}>
            Settings
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            variant="text"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => setShowConfirmation(true)}
          >
            Log Out
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavMenu;
