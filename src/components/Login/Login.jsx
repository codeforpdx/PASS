// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

/**
 * Login Component - Component that generates Login section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Login
 */

const Login = () => (

  /* eslint-disable jsx-a11y/label-has-associated-control */
    <Container component="main" maxWidth="s">
      <Box
        sx={{
          marginTop: 18,
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
)

export default Login;
