// React Imports
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Inrupt Imports
import { getStringNoLocale, getThing, getWebIdDataset } from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';

// Material UI Imports
import Stack from '@mui/material/Box';
import Container from '@mui/material/Container';
// import Paper from '@mui/material/Paper';

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
    <Container sx={{ padding: '100px' }}>
      <Stack
        sx={{
          my: 3,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
          // Apply box/stack stylings to the Paper component
          width: '600px',
          padding: '20px',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {session.info.isLoggedIn ? (
          <ShowNewPod oidcIssuer={oidcIssuer} />
        ) : (
          <PodRegistrationForm register={registerAndLogin} caseManagerName={caseManagerName} />
        )}
      </Stack>
    </Container>
  );
};
export default Signup;
