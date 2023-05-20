// React Imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
// Inrupt Library Imports
import { SessionProvider } from '@inrupt/solid-ui-react';
// Material UI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
// Component Imports
import App from './App';
import Layout from './layouts/Layouts';
// Other Imports
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <SessionProvider>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <Layout>
            <App />
          </Layout>
        </ThemeProvider>
      </SessionProvider>
    </Router>
  </React.StrictMode>
);
