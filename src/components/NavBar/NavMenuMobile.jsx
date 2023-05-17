// React Imports
import React from 'react';
// Solid Imports
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


/**
 * NavMenuMobile Component - Component that generates NavMenuMobile section for PASS
 *
 * @memberof GlobalComponents
 * @name NavMenuMobile
 */

const NavMenuMobile = ({
  mobileMenuId,
  openMobileMenu,
  setOpenMobileMenu,
  anchorElMobile,
  setAnchorElMobile,
  setShowConfirmation
}) => {
  const { session } = useSession();

  const handleMenuMobileClose = () => {
    setOpenMobileMenu(false);
    setAnchorElMobile(null);
  };

  return (
    <Menu
      anchorEl={anchorElMobile}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={openMobileMenu}
      onClick={handleMenuMobileClose}
      onClose={handleMenuMobileClose}
      sx={{ mt: 5 }}
    >
      <MenuList>
        <MenuItem>
          <Button variant="text" startIcon={<NotificationsIcon />} >
            Notifications
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            variant="text"
            startIcon={<AccountCircle />}
            href={session.info.webId}
            target="_blank"
            rel="noreferrer"
          >
            Profile
          </Button>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Button variant="text" startIcon={<SettingsIcon />} >
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
            Logout
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavMenuMobile;
