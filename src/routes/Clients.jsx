// React Imports
import React, { useState, useContext } from 'react';
// React Router Imports
import { useLocation } from 'react-router-dom';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// Component Imports
import AddClientModal from '../components/Clients/AddClientModal';
import ClientList from '../components/Clients/ClientList';
import Loading from '../components/Notification/Loading';
import { UserListContext } from '../contexts';

/**
 * Clients Component - Component that generates Clients Page for PASS
 *
 * @memberof Pages
 * @name Clients
 */

const Clients = () => {
  // state for AddClientModal component
  const [showModal, setShowModal] = useState(false);

  const { loadingUsers } = useContext(UserListContext);

  const location = useLocation();
  localStorage.setItem('restorePath', location.pathname);

  return loadingUsers ? (
    <Container>
      <Loading loadingItem="clients" />
    </Container>
  ) : (
    <Container>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        aria-label="Add Client Button"
        startIcon={<AddIcon />}
        onClick={() => setShowModal(true)}
        sx={{ marginTop: '3rem' }}
      >
        Add Client
      </Button>
      <ClientList />
      {/* modal/popup renders when showConfirmationModal state is true */}
      <AddClientModal showModal={showModal} setShowModal={setShowModal} />
    </Container>
  );
};

export default Clients;
