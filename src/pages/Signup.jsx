// React Imports
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Inrupt Imports
import { getThing, getWebIdDataset, getStringNoLocale } from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';

// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// Constant Imports
import { ENV } from '@constants';

// Signup Form Imports
import { PodRegistrationForm, ShowNewPod, initializePod, registerPod } from '@components/Signup';
import { Typography } from '@mui/material';

/**
 * Signup - First screen in the user registration flow.
 * Allows users to either create a pod, or sign into an existing pod
 *
 * @memberof Pages
 * @name Signup
 * @returns {React.Component} - A react page
 */
const Signup = () => {
  const [oidcIssuer] = useState(ENV.VITE_SOLID_IDENTITY_PROVIDER);
  const [searchParams] = useSearchParams();
  const caseManagerWebId = decodeURIComponent(searchParams.get('webId'));
  const [caseManagerName, setCaseManagerName] = useState();
  const [step, setStep] = useState('begin');
  const [registrationInfo, setRegistrationInfo] = useState({});

  const registerAndInitialize = async (email, password, confirmPassword) => {
    setStep('loading');
    const registration = await registerPod(
      {
        email,
        password,
        confirmPassword
      },
      oidcIssuer
    );
    setRegistrationInfo(registration);
    const caseManagerNames = caseManagerName?.split(' ') || [];
    await initializePod(
      registration.webId,
      registration.podUrl,
      {
        caseManagerWebId,
        caseManagerFirstName: caseManagerNames[0],
        caseManagerLastName: caseManagerNames[caseManagerNames.length - 1]
      },
      registration.fetch
    );
    setStep('done');
  };

  const loadProfileInfo = async () => {
    if (caseManagerWebId === 'null') return;
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
        {step === 'begin' && (
          <PodRegistrationForm register={registerAndInitialize} caseManagerName={caseManagerName} />
        )}
        {step === 'loading' && <Typography>Creating Pod...</Typography>}
        {step === 'done' && (
          <ShowNewPod
            oidcIssuer={oidcIssuer}
            podUrl={registrationInfo.podUrl}
            webId={registrationInfo.webId}
          />
        )}
      </Box>
    </Container>
  );
};

export default Signup;
