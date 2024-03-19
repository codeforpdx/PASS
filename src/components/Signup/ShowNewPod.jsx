import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const ShowNewPod = ({ oidcIssuer, podUrl, webId, isSuccess, data }) => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <Typography
      variant="h4"
      style={{
        marginBottom: '20px',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        '@media (max-width:600px)': { fontSize: '2rem' }
      }}
    >
      Congratulations!
    </Typography>
    <Typography
      variant="body1"
      style={{
        marginBottom: '10px',
        fontSize: '1.2rem',
        '@media (max-width:600px)': { fontSize: '1rem' }
      }}
    >
      You have successfully registered for a pod.
    </Typography>
    <Typography
      variant="body2"
      style={{
        marginBottom: '10px',
        fontSize: '1rem',
        '@media (max-width:600px)': { fontSize: '0.9rem' }
      }}
    >
      You can access your pod through your Pod Provider: <a href={oidcIssuer}>{oidcIssuer}</a>
    </Typography>
    <Typography
      variant="body2"
      style={{
        marginBottom: '10px',
        fontSize: '1rem',
        '@media (max-width:600px)': { fontSize: '0.9rem' }
      }}
    >
      We set up this pod to operate with PASS: <a href={podUrl}>{podUrl}</a>
    </Typography>
    <Typography
      variant="body2"
      style={{
        marginBottom: '10px',
        fontSize: '1rem',
        '@media (max-width:600px)': { fontSize: '0.9rem' }
      }}
    >
      Your Pod Provider has created this webId for you: <a href={webId}>{webId}</a>
    </Typography>
    <Typography
      variant="body1"
      style={{
        marginBottom: '10px',
        fontSize: '1.2rem',
        '@media (max-width:600px)': { fontSize: '1rem' }
      }}
    >
      {isSuccess && data.length > 0
        ? `You have registered with ${data[0].person}`
        : 'You have not registered with a case manager'}
    </Typography>
    <Typography
      variant="body1"
      style={{
        marginTop: '20px',
        fontSize: '1.2rem',
        '@media (max-width:600px)': { fontSize: '1rem' }
      }}
    >
      Click here to return to the home page and log into PASS:
    </Typography>
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/"
      style={{ marginTop: '10px' }}
    >
      Homepage
    </Button>
  </div>
);

export default ShowNewPod;
