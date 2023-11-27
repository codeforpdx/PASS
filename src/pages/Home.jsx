// React Imports
import React, { useRef } from 'react';
// Material UI Imports
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import IconButton from '@mui/material/IconButton';
import SecurityIcon from '@mui/icons-material/Security';
import Stack from '@mui/material/Stack';
import SupportIcon from '@mui/icons-material/Support';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
// Components Import
import { HomeSection, KeyFeatures } from '@components/Home';

/**
 * Home - First Page you encounter in PASS before login.
 * Should not display if you are already logged in.
 *
 * @memberof Pages
 * @name Home
 * @returns {React.ReactElement} The home page
 */
const Home = () => {
  const theme = useTheme();
  const isReallySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const iconSize = isReallySmallScreen ? 'medium' : 'large';
  const aboutRef = useRef(null);

  const handleClick = () => aboutRef.current.scrollIntoView({ behavior: 'smooth' });

  // Logo section elements
  const heading = (
    <>
      PASS
      {/* This is added for better screen reader experience by adding a pause
          between the acronym and the expanded acronym. */}
      <Box component="span" sx={visuallyHidden}>
        :
      </Box>
    </>
  );
  const subheading = 'Personal Access System for Services';

  const logoSection = isReallySmallScreen ? (
    <Typography component="h1" color="primary">
      <Stack
        component="span"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        mb={2}
        data-testid="testStack"
      >
        <Typography variant="h1" component="span" fontWeight="500" fontSize="72px">
          {heading}
        </Typography>
        <Box component="img" src="/assets/PASSLogolightmode.png" alt="" width="50%" />
        <Typography variant="h4" component="span" fontWeight="600" mb={8}>
          {subheading}
        </Typography>
      </Stack>
    </Typography>
  ) : (
    <Typography component="h1" color="primary">
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={4}
        mb={18}
        data-testid="testStack"
      >
        <Stack
          component="span"
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Box component="img" src="/assets/PASSLogolightmode.png" alt="" width="150px" />
          <Typography variant="h1" component="span" fontWeight="500" fontSize="144px">
            {heading}
          </Typography>
        </Stack>
        <Typography variant="h3" component="span" fontWeight="600">
          {subheading}
        </Typography>
      </Stack>
    </Typography>
  );

  return (
    <Container sx={{ width: '100vw' }}>
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
        <section id="home" data-testid="testHomeSection">
          <Stack alignItems="center" justifyContent="center">
            <Box
              height="calc(100vh - 64px)"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              {logoSection}
              <Typography color="secondary.main" sx={{ fontSize: '24px' }}>
                Learn More
              </Typography>
              <IconButton aria-label="Scroll down" color="secondary" onClick={handleClick}>
                <ArrowCircleDownOutlinedIcon sx={{ fontSize: '32px' }} />
              </IconButton>
            </Box>
            <div ref={aboutRef}>
              <HomeSection
                isReallySmallScreen={isReallySmallScreen}
                componentImageSrc="/assets/web-security-green.png"
                componentImageAlt=""
                title="Keep Your Documents Safe and Secure Using Decentralized Technology"
                description="Our innovative solution empowers individuals to manage their critical documents and control access for trusted organizations. PASS simplifies service access, enabling seamless documents requests and secure data sharing for a smoother support process."
                button="Request a Demo"
                href="mailto:hugh@codeforpdx.org"
                hasMargin
              />
              <HomeSection
                isReallySmallScreen={isReallySmallScreen}
                componentImageSrc="/assets/app-green.png"
                componentImageAlt=""
                title="An App for Caseworkers"
                description="PASS allows users to quickly and securely share documents of their clients within the app. The app helps caseworkers verify and share documents such as ID and proof of income while retaining total control of them."
                hasMargin
              />
              <HomeSection
                isReallySmallScreen={isReallySmallScreen}
                componentImageSrc="/assets/key-features-green.png"
                componentImageAlt=""
                title="Key Features"
              />
              <KeyFeatures
                isReallySmallScreen={isReallySmallScreen}
                icon={<SecurityIcon fontSize={iconSize} />}
                title="Secure Storage"
                description="Store vital documents like IDs, Social Security information, birth certificates, medical records, and bank statements in a valid digital format."
              />
              <KeyFeatures
                isReallySmallScreen={isReallySmallScreen}
                icon={<Diversity1Icon fontSize={iconSize} />}
                title="Nonprofit-Caseworker Integration"
                description="The platform facilitates smooth communication between nonprofit organizations, case workers, and the individuals they serve. It allows nonprofit organizations to maintain a contact list, and caseworkers are assigned contacts whose data they can access securely."
              />
              <KeyFeatures
                isReallySmallScreen={isReallySmallScreen}
                icon={<SupportIcon fontSize={iconSize} />}
                title="Support Service"
                description="Verified documents can be used to facilitate access to service such as housing support and shelter accommodation. The platform simplifies the process of submitting necessary documents for such services."
              />
            </div>
          </Stack>
        </section>
      </Box>
    </Container>
  );
};

export default Home;
