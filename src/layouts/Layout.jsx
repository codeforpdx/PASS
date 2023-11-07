// React Imports
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from '@mui/material/Typography';
// Component Imports
import { NavBar } from '../components/NavBar';
import { InactivityMessage } from '../components/Notification';
import Footer from '../components/Footer/Footer';
import NotificationContainer from '../components/Notification/NotificationContainer';
import useNotification from '../hooks/useNotification';

const Layout = ({ ariaLabel, children }) => {
  const { session } = useSession();
  const { state } = useNotification();
  const location = useLocation();

  const crumbs = location?.pathname
    .split('/')
    .slice(1)
    .map((crumb) => {
      let string = crumb;
      string = decodeURIComponent(crumb.replace('-', ' '));
      if (!string.includes('http')) {
        string = string
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
      }
      return string;
    });

  return (
    <Box
      aria-label={ariaLabel}
      sx={{
        display: 'grid',
        gridTemplateRows: {
          xs: 'none',
          sm: session.info.isLoggedIn ? '64px 64px 1fr 280px' : '64px 1fr 280px'
        },
        minHeight: '100vh'
      }}
    >
      <NavBar />
      {session.info.isLoggedIn && (
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ margin: '20px 80px', width: '100%' }}
        >
          {crumbs.map((crumb, index) =>
            index !== crumbs.length - 1 ? (
              <Link
                to={`/${crumbs
                  .slice(0, index + 1)
                  .join('/')
                  .replaceAll(' ', '-')
                  .toLowerCase()}`}
                key={crumb}
              >
                {crumb}
              </Link>
            ) : (
              <Typography key={crumb}>{crumb}</Typography>
            )
          )}
        </Breadcrumbs>
      )}
      {children}
      {session.info.isLoggedIn && <InactivityMessage />}
      <Footer />
      <NotificationContainer notifications={state.notifications} />
    </Box>
  );
};

export default Layout;
