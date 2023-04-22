import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSession } from '@inrupt/solid-ui-react';

const NavMenu = ({ menuId, openMenu, setOpenMenu, anchorEl, setAnchorEl }) => {
  const { session } = useSession();
  const handleMenuClose = () => {
    console.log('Closed!');
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
      sx={{ marginTop: '40px' }}
    >
      <MenuItem onClick={handleMenuClose}>
        <a
          href={session.info.webId}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', color: 'black' }}
        >
          Profile
        </a>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
};

export default NavMenu;
