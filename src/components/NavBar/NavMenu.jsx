// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import theme from '../../theme';

/**
 * NavMenu Component - Component that generates NavMenu section for PASS
 *
 * @memberof GlobalComponents
 * @name NavMenu
 */

const NavMenu = ({ menuId, openMenu, setOpenMenu, anchorEl, setAnchorEl, setShowConfirmation }) => {
  const { session } = useSession();

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
        <MenuItem
          component={Button}
          variant="text"
          startIcon={<AccountCircle />}
          href={session.info.webId}
          target="_blank"
          rel="noreferrer"
          sx={{ color: theme.palette.primary.main }}
        >
          Profile
        </MenuItem>
        <Divider />
        <MenuItem
          component={Button}
          variant="text"
          startIcon={<SettingsIcon />}
          sx={{ color: theme.palette.primary.main }}
        >
          Settings
        </MenuItem>
        <MenuItem
          component={Button}
          startIcon={<LogoutIcon />}
          onClick={() => setShowConfirmation(true)}
          sx={{ color: theme.palette.error.main }}
        >
          Log Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavMenu;
