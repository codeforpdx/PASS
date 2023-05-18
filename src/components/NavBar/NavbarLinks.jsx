// React Imports
import { React, useState } from 'react';
// React Router Imports
import { NavLink } from 'react-router-dom';
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

  // Navigate To... button and menu (small screens)
  const navigateToMenuItems = [
    { label: 'Home', path: '/PASS/home' },
    { label: 'Forms', path: '/PASS/forms' },
    { label: 'Inbox', path: '/PASS/inbox' }
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const openNavigateToMenu = Boolean(anchorEl);
  const handleNavigateToButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNavigateToMenuClose = () => {
    setAnchorEl(null);
  };

  // Tabs (larger screens)
  const [tabValue, setTabValue] = useState('home');
  const handleChange = (event, newTabValue) => {
    setTabValue(newTabValue);
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
        {navigateToMenuItems.map((item) => (
          <MenuItem key={item.label} disableTouchRipple>
            <Button variant="text">
              <NavLink
                to={item.path}
                end
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : '',
                  color: isActive
                    ? theme.palette.tertiary.main
                    : theme.palette.primary.main,
                  textDecoration: 'none'
                })}
                onClick={handleNavigateToMenuClose}
              >
                {item.label}
              </NavLink>
            </Button>
          </MenuItem>
        ))}
      </Menu>

      {/* will show on larger screen (tablet/desktop view) */}
      <Tabs
        value={tabValue}
        onChange={handleChange}
        textColor="inherit"
        aria-label="tabs"
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        <Tab value="home" label="Home" component={NavLink} to="/PASS/home/" />
        <Tab value="forms" label="Forms" component={NavLink} to="/PASS/forms/" />
        <Tab value="inbox" label="Inbox" component={NavLink} to="/PASS/inbox/" />
      </Tabs>
    </>
  );
};

export default NavbarLinks;