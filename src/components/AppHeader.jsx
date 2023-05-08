// React Imports
import React from 'react';
import { Link } from 'react-router-dom';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import { styled, alpha } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

/**
 * AppHeader Component - Component that generates AppHeader section for PASS
 *
 * @memberof GlobalComponents
 * @name AppHeader
 */

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '0ch',
      '&:focus': {
        width: '40ch'
      }
    }
  }
}));

const AppHeader = () => {
  const { session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {session.info.isLoggedIn ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleMenu}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Button startIcon={<AddIcon />}>Add Client</Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button startIcon={<AccountCircleIcon />}>My Account</Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/PASS/home/">
                    <Button startIcon={<HomeIcon />}>Home</Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/PASS/forms/">
                    <Button startIcon={<AssignmentIcon />}>Forms</Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button startIcon={<LogoutIcon />}>Log out</Button>
                </MenuItem>
              </Menu>
              <Box sx={{ flexGrow: 1 }} />
              <Typography
                variant="h4"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                PASS
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
              </Search>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="h4" noWrap component="div">
                Getting started with PASS
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppHeader;
