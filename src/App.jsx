// React Imports
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// Inrupt Library Imports
import { SessionProvider } from '@inrupt/solid-ui-react';
// Material UI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
      <UserDataContextProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </UserDataContextProvider>
    </ThemeProvider>
  </SessionProvider>
);

export default App;
