// React Imports
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from '@contexts';
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
