// React Imports
import React from 'react';

// MUI imports
import Typography from '@mui/material/Typography';

// Hooks imports
import useSession from '@hooks/useSession';
import { useContactsList } from '@hooks';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * A React component for displaying information about a newly registered Solid Pod.
 *
 * @namespace ShowNewPod
 * @param {object} props - Component props.
 * @param {string} props.oidcIssuer - The OIDC issuer URL associated with the pod.
 * @returns {React.JSX} The rendered React component.
 */
const ShowNewPod = ({ oidcIssuer }) => {
  const { session } = useSession();
  const { data, isSuccess } = useContactsList();

  return (
    <>
      <h1>You have successfully registered for a pod.</h1>
      <Typography>
        You can find your pod here: {oidcIssuer}
        <br />
        Your webId is: {session.info.webId}
        <br />
        {isSuccess && data.length > 0
          ? `You have registered with ${data[0].person}`
          : 'You have not registered with a case manager'}
      </Typography>
      <Typography>Click here to return to the home page and log into PASS:</Typography>
      <Button>
        <Link to={window.location.origin}>Homepage</Link>
      </Button>
    </>
  );
};

export default ShowNewPod;
