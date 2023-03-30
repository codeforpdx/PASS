import React from 'react';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();

  return (
    <Card variant="outlined">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <section id="logout" className="panel">
            <div className="row">
              <label id="labelLogout" htmlFor="btnLogout">
                Click the following logout button to log out of your pod:{' '}
              </label>
              <LogoutButton>
                {/* <button type="submit">Logout</button> */}
                <Button variant="contained" type="submit" color="error" size="large">
                  Logout
                </Button>{' '}
              </LogoutButton>

              <p className="labelStatus" role="alert">
                Your session is now logged in with the WebID [
                <a href={session.info.webId} target="_blank" rel="noreferrer">
                  {session.info.webId}
                </a>
                ].
              </p>
            </div>
          </section>
        </Box>
      </Container>
    </Card>
  );
};

export default Logout;
