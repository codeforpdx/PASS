import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSession } from '@inrupt/solid-ui-react';

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
  setAnchorElMobile
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
        <MenuItem onClick={handleMenuMobileClose}>
          <IconButton size="large" aria-label="show new notifications" color="inherit">
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText>Notifications</ListItemText>
          </IconButton>
        </MenuItem>
        <MenuItem onClick={handleMenuMobileClose}>
          <Link
            href={session.info.webId}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
              edge="start"
            >
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </IconButton>
          </Link>
        </MenuItem>

        {/* <MenuItem onClick={handleMenuMobileClose}>
          <Link
            href={session.info.webId}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
              edge="start"
            >
              <AccountCircle />
            </IconButton>
            Profile
          </Link>
        </MenuItem> */}
      </MenuList>
    </Menu>
  );
};

export default NavMenuMobile;
