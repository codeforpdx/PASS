// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import SupportIcon from '@mui/icons-material/Support';
import Stack from '@mui/material/Stack';
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
              src="public/assets/web-security-green.png"
              alt="Web security"
              title="Keep Your Documents Safe and Secure Using Decentralized Technology"
              description="Our innovatice solution empowers individuals to manage their critical documents and control access for trusted organizations. PASS simplifies service access, enabling seamless documents requests and secure data sharing for a smoother support process. "
              button="Request a Demo"
              href="mailto:hugh@codeforpdx.org"
              label="Demo request button"
            />
            <HomeSection
              isReallySmallScreen={isReallySmallScreen}
              src="public/assets/app-green.png"
              alt="Web App"
              title="An App Built for Case Workers"
              description="Pass allows users to quickly and securely share documents of their clients within the app. The app helps case workes verify and share documents such as ID and proof of income while having total control of the documents."
            />
            <HomeSection
              isReallySmallScreen={isReallySmallScreen}
              src="public/assets/key-features-green.png"
              alt="Key Features"
              title="Key Features"
            />
            <KeyFeatures
              isReallySmallScreen={isReallySmallScreen}
              icon={<SecurityIcon fontSize={isReallySmallScreen ? 'medium' : 'large'} />}
              title="Secure Storage"
              description="Store vital documents like IDs, social security information, birth certificates, medical records, and bank statements in a digital, valid format."
            />
            <KeyFeatures
              isReallySmallScreen={isReallySmallScreen}
              icon={<Diversity1Icon fontSize={isReallySmallScreen ? 'medium' : 'large'} />}
              title="Non-Profit & Caseworker Intergration"
              description="The platform facilitates smooth communication between non-profit organizations, caseworkers, and the individuals they sesrve. It allows non-profit organizations to maintain a contact list, and casewrokes are assigned contacts whose pods they can access securely."
            />
            <KeyFeatures
              isReallySmallScreen={isReallySmallScreen}
              icon={<SupportIcon fontSize={isReallySmallScreen ? 'medium' : 'large'} />}
              title="Support Service"
              description="Verified documents can be used to facilitate access to service such as housing support and shelter accommodation. The platform simplidies the process of submitting necessary documents for such services."
            />
          </Stack>
        </section>
      </Box>
    </Container>
  );
};

export default Home;
