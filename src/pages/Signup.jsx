// React Imports
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Inrupt Imports
import { getThing, getWebIdDataset, getStringNoLocale } from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';

// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

// Custom Hook Imports
import useContactsList from '@hooks/useContactsList';
import useSession from '@hooks/useSession';
// Constant Imports
import { ENV } from '@constants';

// Signup Form Imports
import { PodRegistrationForm, ShowNewPod, initializePod, registerPod } from '@components/Signup';

/**
 * Signup - First screen in the user registration flow.
 * Allows users to either create a pod, or sign into an existing pod
 *
 * @memberof Pages
 * @name Signup
 * @returns {React.Component} - A react page
 */
const Signup = () => {
  const [oidcIssuer] = useState(ENV.VITE_SOLID_POD_SERVER || ENV.VITE_SOLID_IDENTITY_PROVIDER);
  const [searchParams] = useSearchParams();
  const caseManagerWebId = decodeURIComponent(searchParams.get('webId'));
  const [caseManagerName, setCaseManagerName] = useState();
  const { session, login, podUrl } = useSession();
  const { addContact, isSuccess } = useContactsList();

  const registerAndLogin = async (email, password, confirmPassword) => {
    await registerPod(
      {
        email,
        password,
        confirmPassword
      },
      oidcIssuer
    );

    await login({
      oidcIssuer,
      redirectUrl: window.location.href,
      clientName: 'PASS Registration'
    });
  };

  const loadProfileInfo = async () => {
    try {
      const profile = await getWebIdDataset(caseManagerWebId);
      const profileThing = getThing(profile, caseManagerWebId);
      setCaseManagerName(getStringNoLocale(profileThing, FOAF.name));
    } catch {
      setCaseManagerName(null);
    }
  };

  useEffect(() => {
    loadProfileInfo();
  }, []);

  useEffect(() => {
    if (session.info?.isLoggedIn)
      initializePod(session.info.webId, podUrl, caseManagerWebId, session.fetch);
  }, [session.info.isLoggedIn]);

  useEffect(() => {
    if (isSuccess && caseManagerWebId) {
      const [cmFirstName, cmLastName] = caseManagerName?.split(' ') ?? [null, null];
      addContact({
        givenName: cmFirstName,
        familyName: cmLastName,
        webId: caseManagerWebId
      });
    }
  }, [isSuccess]);

  return (
    <Container>
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: 'inline-block',
            mx: '2px',
            padding: '20px',
            minWidth: '400px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          }}
        >
          {session.info.isLoggedIn ? (
            <ShowNewPod oidcIssuer={oidcIssuer} />
          ) : (
            <PodRegistrationForm register={registerAndLogin} caseManagerName={caseManagerName} />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
