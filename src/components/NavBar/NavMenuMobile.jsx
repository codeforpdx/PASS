import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSession } from '@inrupt/solid-ui-react';

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
      sx={{ marginTop: '40px' }}
    >
      <MenuItem onClick={handleMenuMobileClose}>
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
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
          >
            <AccountCircle />
          </IconButton>
          Profile
        </Link>
      </MenuItem>
    </Menu>
  );
};

export default NavMenuMobile;
