// React Imports
import React from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// Custom Hooks Imports
import { useContactsList } from '@hooks';

/**
 * ShowNewPod - Component for displaying information about a newly registered Solid Pod.
 *
 * @memberof Signup
 * @namespace ShowNewPod
 * @param {object} props - Component props
 * @param {string} props.oidcIssuer - The URL of the Pod provider
 * @param {string} props.podUrl - The URL of the newly created pod
 * @param {string} props.webId - The user's new web ID
 * @returns {React.JSX} The rendered React component
 */
const ShowNewPod = ({ oidcIssuer, podUrl, webId }) => {
  const { data, isSuccess } = useContactsList();

  return (
    <>
      {podUrl ? (
        <h1>You have successfully registered for a pod.</h1>
      ) : (
        <h1>You have logged in with your existing pod.</h1>
      )}
      <Typography>
        {podUrl && (
          <>
            {'You can access your pod through your Pod Provider: '}
            <Link to={oidcIssuer}>{oidcIssuer}</Link>
            <br />
            {'We set up this pod to operate with PASS: '}
            <Link to={podUrl}>{podUrl}</Link>
            <br />
          </>
        )}
        {webId && (
          <>
            {'Your Pod Provider has created this webId for you: '}
            <Link href={webId}>{webId}</Link>
            <br />
          </>
        )}
        {isSuccess && data.length > 0
          ? `You have registered with ${data[0].person}.`
          : 'You have not registered with a case manager.'}
      </Typography>

      <br />
      <Typography>Click here to return to the home page and log into PASS:</Typography>
      <Button>
        <Link to={window.location.origin}>Homepage</Link>
      </Button>
    </>
  );
};

export default ShowNewPod;
