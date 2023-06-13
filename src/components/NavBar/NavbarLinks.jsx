// React Imports
import { React, useState } from 'react';
// React Router Imports
import { NavLink, useLocation } from 'react-router-dom';
// Material UI Imports
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';

const NavbarLinks = () => {
  const theme = useTheme();

  // Tabs workaround to match route on login
  let location = useLocation().pathname.slice(6);
  if (location === '') {
    location = 'clients';
  }

  // array of current nav links for menus
  const routesArray = [
    { label: 'Clients', path: '/PASS/clients' },
    { label: 'User', path: 'PASS/user' },
    { label: 'Forms', path: '/PASS/forms' },
    { label: 'Inbox', path: '/PASS/inbox' },
    { label: 'Outbox', path: '/PASS/outbox' }
  ];

  // Navigate To... button and menu (small screens)
  const [anchorEl, setAnchorEl] = useState(null);
  const openNavigateToMenu = Boolean(anchorEl);
  const handleNavigateToButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNavigateToMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* will show on small screen (mobile view) */}
      <Button
        id="mobile-navigate-menu-button"
        aria-controls={openNavigateToMenu ? 'mobile-navigate-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openNavigateToMenu ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleNavigateToButtonClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        Navigate To...
      </Button>
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        id="mobile-navigate-menu"
        MenuListProps={{
          'aria-labelledby': 'mobile-navigate-menu-button'
        }}
        anchorEl={anchorEl}
        open={openNavigateToMenu}
        onClose={handleNavigateToMenuClose}
        sx={{ backgroundColor: 'rgba(1, 121, 105, 0.2)' }}
      >
        {routesArray.map((item) => {
          const currentRoute = useLocation().pathname.includes(item.path);
          return (
            <MenuItem key={item.label} disableTouchRipple>
              <Button variant="text">
                <NavLink
                  to={item.path}
                  end
                  style={{
                    fontWeight: currentRoute ? 'bold' : '',
                    color: currentRoute ? theme.palette.tertiary.main : theme.palette.primary.main,
                    textDecoration: 'none'
                  }}
                  onClick={handleNavigateToMenuClose}
                >
                  {item.label}
                </NavLink>
              </Button>
            </MenuItem>
          );
        })}
      </Menu>

      {/* will show on larger screen (tablet/desktop view) */}
      <Tabs
        value={location}
        textColor="inherit"
        indicatorColor="secondary"
        aria-label="tabs"
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        {routesArray.map((item) => (
          <Tab
            key={`${item.label}Tab`}
            value={item.label.toLowerCase()}
            label={item.label}
            component={NavLink}
            to={item.path}
          />
        ))}
      </Tabs>
    </>
  );
};

export default NavbarLinks;
