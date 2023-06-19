// React Imports
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
// Inrupt Library Imports
import { SessionProvider } from '@inrupt/solid-ui-react';
// Material UI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Context Imports
import UserDataContextProvider from './contexts/UserDataContext';
// Theme Imports
import theme from './theme';
// Layout Imports
import Layout from './layouts/Layout';
// Route Imports
import AppRoutes from './AppRoutes';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("./typedefs").messageListObject} messageListObject
 */

const App = () => (
  <Router>
    <SessionProvider>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Layout ariaLabel="Home Page">
          <UserDataContextProvider>
            <AppRoutes />
          </UserDataContextProvider>
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  </Router>
);

export default App;
