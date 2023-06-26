// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Layout from '../layouts/Layout';

/**
 * Home - First Page you encounter in PASS before login.
 * Should not display if you are already logged in
 *
 * @memberof Pages
 * @name Home
 * @returns {React.ReactElement} The home page
 */
const Home = () => (
  <Layout>
    <Container component="main" maxWidth="s">
      <Box
        sx={{
          marginTop: 18,
          marginBottom: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <section id="home">
            <h1>HOME PAGE</h1>
          </section>
        </Paper>
      </Box>
    </Container>
  </Layout>
);

export default Home;
