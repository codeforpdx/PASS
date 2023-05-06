import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { SessionProvider } from '@inrupt/solid-ui-react';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import './style.css';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </SessionProvider>
    </Router>
  </React.StrictMode>
);
