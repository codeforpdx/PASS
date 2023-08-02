// React Imports
import React, { useState } from 'react';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// Component Imports
import { useContactsList } from '@hooks';
import { AddContactModal, DeleteContactModal } from '@components/Modals';
import { ContactListTable } from '@components/Contacts';
import { LoadingAnimation, EmptyListNotification } from '@components/Notification';

/**
 * Contacts Component - Component that generates Contacts Page for PASS
 *
 * @memberof Pages
 * @name Contacts
 */

const Contacts = () => {
  localStorage.setItem('restorePath', '/contacts');
  // state for AddContactModal component
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [selectedContactToDelete, setSelectedContactToDelete] = useState(null);

  const handleSelectDeleteContact = (contact) => {
    setSelectedContactToDelete(contact);
    setShowDeleteContactModal(true);
  };

  const { data, isLoading, isError, error, addContact, deleteContact } = useContactsList();

  if (isLoading) return <LoadingAnimation loadingItem="Contacts" />;
  if (isError) return <Typography>Error loading contacts list: {error.message}</Typography>;
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          aria-label="Add Contact Button"
          startIcon={<AddIcon />}
          onClick={() => setShowAddContactModal(true)}
          sx={{ marginTop: '3rem' }}
        >
          Add Contact
        </Button>
        {data.length > 0 ? (
          <ContactListTable
            contacts={data}
            deleteContact={(contact) => handleSelectDeleteContact(contact)}
          />
        ) : (
          <EmptyListNotification type="Contacts" />
        )}
      </Box>

      {/* modal/popup renders when showAddContactModal state is true */}
      <AddContactModal
        showAddContactModal={showAddContactModal}
        setShowAddContactModal={setShowAddContactModal}
        addContact={addContact}
      />
      <DeleteContactModal
        showDeleteContactModal={showDeleteContactModal}
        setShowDeleteContactModal={setShowDeleteContactModal}
        selectedContactToDelete={selectedContactToDelete}
        deleteContact={deleteContact}
      />
    </Container>
  );
};

export default Contacts;
