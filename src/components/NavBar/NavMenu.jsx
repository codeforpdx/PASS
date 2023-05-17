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
      sx={{ mt: 5 }}
    >
      <MenuList>
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

export default NavMenu;
