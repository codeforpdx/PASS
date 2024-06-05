// React Imports
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/system';
// Component Imports
import { CIVIC_FORM_LIST } from '@components/CivicProfileForms';

/**
 * CivicProfile - Component that generates the Civic Profile for PASS
 *
 * @memberof Pages
 * @name CivicProfile
 * @returns {React.ReactNode} The Civic Profile
 */
const CivicProfile = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);
  const currentForm = location.pathname.split('/').pop();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row' }}>
      <Box sx={{ width: isSmallScreen ? '100%' : '25%', minWidth: '250px' }}>
        <nav>
          <MenuList>
            {CIVIC_FORM_LIST.map((form) => (
              <Link to={form.path} style={{ textDecoration: 'none' }} key={form.path}>
                <MenuItem divider selected={currentForm === form.path}>
                  {form.label}
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </nav>
      </Box>
      <Container>
        <Outlet />
      </Container>
    </Container>
  );
};

export default CivicProfile;
