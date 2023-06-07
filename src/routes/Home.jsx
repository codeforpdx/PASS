// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

/**
 * Home Page - Page that generates the home page of the PASS website/app
 *
 * @memberof Pages
 * @name Home
 */

const Home = () => (
  /* eslint-disable jsx-a11y/label-has-associated-control */
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
  /* eslint-enable jsx-a11y/label-has-associated-control */
);

export default Home;
