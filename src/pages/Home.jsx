// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import SecurityIcon from '@mui/icons-material/Security';
import Stack from '@mui/material/Stack';
import SupportIcon from '@mui/icons-material/Support';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Components Import
import HomeSection from '../components/Home/HomeSection';
import KeyFeatures from '../components/Home/KeyFeatures';

/**
 * Home - First Page you encounter in PASS before login.
 * Should not display if you are already logged in
 *
 * @memberof Pages
 * @name Home
 * @returns {React.ReactElement} The home page
 */
const Home = () => {
  const theme = useTheme();
  const isReallySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container component="main">
      <Box
        sx={{
          margin: '18px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <section id="home">
          <Stack alignItems="center" justifyContent="center">
            <HomeSection
              isReallySmallScreen={isReallySmallScreen}
              src="/assets/web-security-green.png"
              alt="Web security"
              title="Keep Your Documents Safe and Secure Using Decentralized Technology"
              description="Our innovative solution empowers individuals to manage their critical documents and control access for trusted organizations. PASS simplifies service access, enabling seamless documents requests and secure data sharing for a smoother support process."
              button="Request a Demo"
              href="mailto:hugh@codeforpdx.org"
              label="Demo request button"
            />
            <HomeSection
              isReallySmallScreen={isReallySmallScreen}
              src="/assets/app-green.png"
              alt="Web App"
              title="An App Built for Caseworkers"
              description="PASS allows users to quickly and securely share documents of their clients within the app. The app helps caseworkers verify and share documents such as ID and proof of income while retaining total control of them."
            />
            <HomeSection
              isReallySmallScreen={isReallySmallScreen}
              src="/assets/key-features-green.png"
              alt="Key Features"
              title="Key Features"
            />
            <KeyFeatures
              isReallySmallScreen={isReallySmallScreen}
              icon={<SecurityIcon fontSize={isReallySmallScreen ? 'medium' : 'large'} />}
              title="Secure Storage"
              description="Store vital documents like IDs, Social Security information, birth certificates, medical records, and bank statements in a valid digital format."
            />
            <KeyFeatures
              isReallySmallScreen={isReallySmallScreen}
              icon={<Diversity1Icon fontSize={isReallySmallScreen ? 'medium' : 'large'} />}
              title="Nonprofit & Caseworker Integration"
              description="The platform facilitates smooth communication between nonprofit organizations, caseworkers, and the individuals they serve. It allows nonprofit organizations to maintain a contact list, and caseworkers are assigned contacts whose data they can access securely."
            />
            <KeyFeatures
              isReallySmallScreen={isReallySmallScreen}
              icon={<SupportIcon fontSize={isReallySmallScreen ? 'medium' : 'large'} />}
              title="Support Service"
              description="Verified documents can be used to facilitate access to service such as housing support and shelter accommodation. The platform simplifies the process of submitting necessary documents for such services."
            />
          </Stack>
        </section>
      </Box>
    </Container>
  );
};

export default Home;
