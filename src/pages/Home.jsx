// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import SupportIcon from '@mui/icons-material/Support';
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
    <Container component="main" maxWidth="s">
      <Box
        sx={{
          marginTop: 18,
          marginBottom: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <section id="home">
          <Stack
            width={isReallySmallScreen ? 1 : 3 / 3}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Box
                component="img"
                src="./src/assets/web_security.png"
                alt="web-security-image"
                sx={{
                  width: '90%', // Default to 90%
                  '@media (min-width:600px) and (max-width:959px)': {
                    width: '50%'
                  },
                  '@media (min-width:960px) and (max-width:1023px)': {
                    width: '25%'
                  },
                  '@media (min-width:1024px) and (max-width:1439px)': {
                    width: '45%'
                  },
                  '@media (min-width:1440px)': {
                    width: '45%'
                  }
                }}
              />
              <Typography
                sx={{
                  color: 'temporaryPurple.dark',
                  fontSize: { xs: '2rem', sm: '2rem', md: '3rem' },
                  textAlign: 'center',
                  mb: '24px'
                }}
              >
                <strong>Keep your documents safe and secure using decentralized technology.</strong>
              </Typography>
            </Grid>
            <Typography
              sx={{
                color: 'temporaryPurple.text',
                fontSize: { xs: '1rem', sm: '1rem', md: '1.5rem' },
                width: { md: '75%' },
                mb: '24px'
              }}
            >
              Our innovative solution empowers individuals to manage their critical documents and
              control access for trusted organizations. PASS simplifies service access, enabling
              seamless document requests and secure data sharing for a smoother support process.
            </Typography>
            <Button
              variant="contained"
              href="mailto:hugh@codeforpdx.org"
              aria-label="Demo Request Email"
              sx={{
                my: '1rem',
                width: { xs: 1, sm: 1 / 3, md: 1 / 6 },
                color: 'temporaryPurple.main',
                backgroundColor: 'temporaryPurple.light',
                borderRadius: '25px',
                mb: 12
              }}
            >
              Request a demo
            </Button>
            <Box
              component="img"
              src="./src/assets/app.png"
              alt="web-security-image"
              sx={{
                width: '90%', // Default to 90%
                '@media (min-width:600px) and (max-width:959px)': {
                  width: '50%'
                },
                '@media (min-width:960px) and (max-width:1023px)': {
                  width: '25%'
                },
                '@media (min-width:1024px) and (max-width:1439px)': {
                  width: '45%'
                },
                '@media (min-width:1440px)': {
                  width: '45%'
                }
              }}
            />

            <Typography
              sx={{
                color: 'temporaryPurple.dark',
                fontSize: { xs: '2rem', sm: '2rem', md: '3rem' },
                textAlign: { xs: 'center' },
                mb: '24px'
              }}
            >
              <strong>An App Built for Case Workers</strong>
            </Typography>
            <Typography
              sx={{
                color: 'temporaryPurple.text',
                fontSize: { xs: '1rem', sm: '1rem', md: '1.5rem' },
                width: { md: '75%' },
                mb: '10%'
              }}
            >
              PASS allows users to quickly and securely share documents of their clients within the
              app. The app helps case workers verify and share documents such as ID and proof of
              income while having total control of the documents.
            </Typography>
            <img
              src="./src/assets/key-features-image.png"
              alt="logo"
              className="key-features-image"
            />
            <Typography
              sx={{
                color: 'temporaryPurple.dark',
                fontSize: { xs: '2rem', sm: '2rem', md: '3rem' },
                textAlign: { xs: 'center' },
                mb: '50px'
              }}
            >
              <strong>Key Features</strong>
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '14px'
              }}
            >
              <SecurityIcon sx={{ color: 'temporaryPurple.main' }} />
              <Typography
                sx={{
                  marginLeft: '8px', // Optional, to add some space between the icon and text
                  color: 'temporaryPurple.main',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' }
                }}
              >
                <strong>Secure Storage</strong>
              </Typography>
            </Box>
            <Typography
              sx={{
                width: { xs: '90%', md: '65%' },
                textAlign: 'center',
                fontSize: { xs: '.85rem', sm: '1rem', md: '1.25rem' },
                color: 'temporaryPurple.text',
                mb: '50px'
              }}
            >
              Store vital documents like IDs, social security information, birth certificates,
              medical records, and bank statements in a digital, valid format. Stored documents will
              be verified and approved by government agencies.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '6px'
              }}
            >
              <Diversity1Icon sx={{ color: 'temporaryPurple.main' }} />
              <Typography
                sx={{
                  marginLeft: '8px', // Optional, to add some space between the icon and text
                  color: 'temporaryPurple.main',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' }
                }}
              >
                <strong>Non-Profit & Caseworker Integration</strong>
              </Typography>
            </Box>
            <Typography
              sx={{
                width: { xs: '90%', md: '65%' },
                textAlign: 'center',
                fontSize: { xs: '.85rem', sm: '1rem', md: '1.25rem' },
                color: 'temporaryPurple.text',
                mb: '50px'
              }}
            >
              The platform facilitates smooth communication between non-profit organizations,
              caseworkers, and the individuals they serve. It allows non-profit organizations to
              maintain a contact list, and caseworkers are assigned contacts whose &apos;pods&apos;
              they can access securely.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '6px'
              }}
            >
              <SupportIcon sx={{ color: 'temporaryPurple.main' }} />
              <Typography
                sx={{
                  marginLeft: '8px', // Optional, to add some space between the icon and text
                  color: 'temporaryPurple.main',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' }
                }}
              >
                <strong>Support Services</strong>
              </Typography>
            </Box>
            <Typography
              sx={{
                width: { xs: '90%', md: '65%' },
                textAlign: 'center',
                fontSize: { xs: '.85rem', sm: '1rem', md: '1.25rem' },
                color: 'temporaryPurple.text'
              }}
            >
              Verified documents can be used to facilitate access to service such as housing support
              and shelter accommodation. The platform simplifies the process of submitting necessary
              documents for such services.
            </Typography>
          </Stack>
        </section>
      </Box>
    </Container>
  );
};

export default Home;
