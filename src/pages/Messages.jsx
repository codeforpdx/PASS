// React Imports
import React from 'react';
// Material UI Imports
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';

/**
 * Messages Page - Page that generates the components for the Message system
 * in PASS
 *
 * @memberof Pages
 * @name Messages
 * @returns {React.JSX.Element} The Messages Page
 */
const Messages = () => (
  <Container sx={{ display: 'grid', gridTemplateRows: '80px 1fr' }}>
    <Outlet />
  </Container>
);

export default Messages;
