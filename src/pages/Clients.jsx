// React Imports
import React, { useState } from 'react';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// Component Imports
import { AddClientModal } from '../components/Modals';
import { ClientList } from '../components/Clients';

/**
 * Clients Component - Component that generates Clients Page for PASS
 *
 * @memberof Pages
 * @name Clients
 */

const Clients = () => {
  // state for AddClientModal component
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  localStorage.setItem('restorePath', '/clients');

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          size="small"
          aria-label="Add Client Button"
          startIcon={<AddIcon />}
          onClick={() => setShowAddClientModal(true)}
          sx={{ marginTop: '3rem' }}
        >
          Add Client
        </Button>
        <ClientList />
      </Box>

      {/* modal/popup renders when showAddClientModal state is true */}
      <AddClientModal
        showAddClientModal={showAddClientModal}
        setShowAddClientModal={setShowAddClientModal}
      />
    </Container>
  );
};

export default Clients;
