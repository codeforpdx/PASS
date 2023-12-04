// React Imports
import React, { useState } from 'react';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// Component Imports
import { useContactsList, useNotification } from '@hooks';
import { AddContactModal, ConfirmationModal } from '@components/Modals';
import { ContactListTable } from '@components/Contacts';
import { LoadingAnimation, EmptyListNotification } from '@components/Notification';

/**
 * Contacts Component - Component that generates Contacts Page for PASS
 *
 * @memberof Pages
 * @name Contacts
 * @returns {React.JSX.Component} - the Contacts Page
 */
const Contacts = () => {
  localStorage.setItem('restorePath', '/contacts');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedContactToDelete, setSelectedContactToDelete] = useState(null);
  const {
    data,
    isLoading,
    isError,
    error,
    add: addContact,
    delete: deleteContact
  } = useContactsList();
  const { addNotification } = useNotification();

  const handleSelectDeleteContact = (contact) => {
    setSelectedContactToDelete(contact);
    setShowConfirmationModal(true);
  };

  // Event handler for deleting contact
  const handleDeleteContact = async () => {
    setProcessing(true);
    try {
      await deleteContact(selectedContactToDelete);
      addNotification('success', `"${selectedContactToDelete?.person}" deleted from contact list.`);
    } catch (e) {
      addNotification('error', `Contact deletion failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  if (isLoading) return <LoadingAnimation loadingItem="Contacts" />;
  if (isError) return <Typography>Error loading contacts list: {error.message}</Typography>;
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Box>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setShowAddContactModal(true)}
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

      <AddContactModal
        showAddContactModal={showAddContactModal}
        setShowAddContactModal={setShowAddContactModal}
        addContact={addContact}
      />
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        title="Delete Contact"
        text={`Are you sure you want to delete "${selectedContactToDelete?.person}" from your contact list?`}
        onConfirm={handleDeleteContact}
        confirmButtonText="Delete"
        processing={processing}
      />
    </Container>
  );
};

export default Contacts;
