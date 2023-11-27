// React Imports
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUI imports
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// Hooks imports
import useSession from '@hooks/useSession';

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

  return (
    <>
      <h1>You have successfully registered for a pod.</h1>
      <Typography>
        We&apos;ve created a pod for you. You can get to it by going here: {oidcIssuer}
        <br />
        If anyone asks you to share your pod with them, you can give them this web ID:{' '}
        {session.info.webId}
        <br />
        Next we&apos;d like to help you build a profile about yourself that you can share with your
        case managers. This will make it faster and easier for your case managers to get you
        connected to services. All of the data you put in this profile will be yours, and the only
        people who will be able to access it are yourself, and the people you choose to share it
        with. We will ask you some sensitive questions, and you may not feel comfortable answering
        some of them. All data in these forms is optional. If you want don&apos;t want to answer
        certain questions, or you feel they don&apos;t apply to you, skip them. If you don&apos;t
        have time to complete the whole profile, feel free to leave and come back. You can resume
        right where you left off.
        <br />
        Click this button to begin:{' '}
        <Link component={RouterLink} to="/civic-profile">
          {' '}
          Next &gt;
        </Link>
      </Typography>
    </>
  );
};

export default ShowNewPod;
