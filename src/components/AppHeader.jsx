/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
// import InputBase from '@mui/material/InputBase';
import MailIcon from '@mui/icons-material/Mail';
// import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

/**
 * AppHeader Component - Component that generates AppHeader section for PASS
 *
 * @memberof GlobalComponents
 * @name AppHeader
 */

const AppHeader = () => {
  const { session } = useSession();

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
              PASS
            </Typography>
            {session.info.isLoggedIn ? (
              <>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                  color="inherit"
                >
                  <Button>
                    <Link to="/PASS/home/">Home</Link>
                  </Button>
                  <Button>
                    <Link to="/PASS/forms/">Forms</Link>
                  </Button>
                </ButtonGroup>

                <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                  <MenuItem>
                    <Button
                      startIcon={<AddIcon />}
                      color="tertiary"
                      variant="contained"
                      aria-label="outlined primary button group"
                    >
                      Add
                    </Button>
                  </MenuItem>
                </Box>
              </>
            ) : null}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default AppHeader;
