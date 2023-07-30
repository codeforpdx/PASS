// React Imports
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from '@contexts';
// Material UI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NotificationContextProvider } from './contexts/NotificationContext';
// Context Imports
import UserDataContextProvider from './contexts/UserDataContext';
// Theme Imports
import theme from './theme';
// Route Imports
import AppRoutes from './AppRoutes';
import Layout from './layouts/Layout';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("./typedefs").messageListObject} messageListObject
 */

const App = () => (
  <SessionProvider restorePreviousSession>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <NotificationContextProvider>
        <UserDataContextProvider>
          <BrowserRouter>
            <Layout>
              <AppRoutes />
            </Layout>
          </BrowserRouter>
        </UserDataContextProvider>
      </NotificationContextProvider>
    </ThemeProvider>
  </SessionProvider>
);

export default App;
