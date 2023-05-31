// React Imports
import React, { useState } from 'react';
// React Router Imports
import { useLocation } from 'react-router-dom';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Component Imports
import AddClientModal from './AddClientModal';
import ClientList from './ClientList';


/**
 * Clients Component - Component that generates Clients section for PASS
 *
 * @memberof GlobalComponents
 * @name Clients
 */

const Clients = ({ loadingUsers, loadingActive }) => {

  // state for AddClientModal component
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  return (
    loadingUsers ? (
      <Container>
        <Box
          sx={{
            marginTop: 3,
            minWidth: 120,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
            <Typography variant='h5' component='h2' mb={2} align='center'>
              Loading clients...
            </Typography>
            <LinearProgress />
          </Paper>
        </Box>
      </Container>
    ) : (
      <Container>
        {/* <Box sx={{display: 'flex'}}> */}
        {/* <Typography variant='h4' component='h1'>Clients</Typography> */}
        <Button
        variant="contained"
        color="secondary"
        size="small"
        aria-label="Add Client Button"
        startIcon={<AddIcon />}
        onClick={() => setShowModal(true)}
        >
          Add Client
        </Button>
        {/* </Box> */}
        <ClientList loadingActive={loadingActive} />
        {/* modal/popup renders when showConfirmationModal state is true */}
        <AddClientModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </Container>
    )
  );
};

export default Clients;
