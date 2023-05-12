import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSession } from '@inrupt/solid-ui-react';

/**
 * NavMenu Component - Component that generates NavMenu section for PASS
 *
 * @memberof GlobalComponents
 * @name NavMenu
 */

const NavMenu = ({ menuId, openMenu, setOpenMenu, anchorEl, setAnchorEl }) => {
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
      <MenuItem>
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
      </MenuItem>
    </Menu>
  );
};

export default NavMenu;
