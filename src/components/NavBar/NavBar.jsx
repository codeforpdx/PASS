/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import { styled, alpha, ThemeProvider } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MailIcon from '@mui/icons-material/Mail';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Logout from '../Login/Logout';

// eslint-disable-next-line import/extensions
import theme from '../../theme.js';
import NavMenu from './NavMenu';
import NavMenuMobile from './NavMenuMobile';

const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMobile, setAnchorElMobile] = useState(null);

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleOpenMobileMenu = (event) => {
    setAnchorElMobile(event.currentTarget);
    setOpenMobileMenu(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="h4"
              noWrap
              component="div"
              // sx={{ display: { xs: 'flex', sm: 'flex', md: 'flex' } }}
            >
              PASS
            </Typography>
            <div className="navLinks" style={{ display: 'flex', gap: '20px', margin: '0 20px' }}>
              <Link to="/PASS/home/">Home</Link>
              <Link to="/PASS/forms/">Forms</Link>
              <Logout />
            </div>
            <Box sx={{ flexGrow: 1 }} />
            <MenuItem>
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                // sx={{ color: 'brown' }}
                color="inherit"
              >
                <Button startIcon={<AddIcon />} color="secondary">
                  Add
                </Button>
              </ButtonGroup>
            </MenuItem>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleOpenMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleOpenMobileMenu}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {openMobileMenu ? (
          <NavMenuMobile
            mobileMenuId={mobileMenuId}
            openMobileMenu={openMobileMenu}
            setOpenMobileMenu={setOpenMobileMenu}
            anchorElMobile={anchorElMobile}
            setAnchorElMobile={setAnchorElMobile}
          />
        ) : null}
        {openMenu ? (
          <NavMenu
            menuId={menuId}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
        ) : null}
      </Box>
    </ThemeProvider>
  );
};

export default NavBar;
