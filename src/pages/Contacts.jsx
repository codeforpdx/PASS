// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { FormControl, Select, MenuItem, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedContactToDelete, setSelectedContactToDelete] = useState(null);
  const [deleteViaEdit, setDeleteViaEdit] = useState(false);
  const {
    data,
    isLoading,
    isError,
    error,
    add: addContact,
    delete: deleteContact
  } = useContactsList();
  const { addNotification } = useNotification();
  const [fieldType, setFieldType] = useState('First Name');

  const getContactDisplayName = (contact) => {
    if (!contact) {
      return 'Unknown Contact';
    }

    const { givenName, familyName, webId } = contact;
    const name = [givenName, familyName].filter(Boolean).join(' ');
    return name || webId;
  };

  const handleSelectDeleteContact = (contact) => {
    setSelectedContactToDelete(contact);
    setShowConfirmationModal(true);
  };

  const handleDeleteContact = async (contact) => {
    setProcessing(true);
    try {
      // Edit passes the contact as a parameter, deleting from the list table does not
      if (Object.hasOwn(contact, 'webId')) {
        await deleteContact(contact);
        setDeleteViaEdit(!deleteViaEdit);
      } else {
        await deleteContact(selectedContactToDelete);
      }
      const displayName = getContactDisplayName(selectedContactToDelete);
      addNotification('success', `"${displayName}" deleted from contact list.`);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {isSmallScreen && (
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                id="contact-select-field-small"
                value={fieldType}
                defaultValue="First Name"
                onChange={(e) => setFieldType(e.target.value)}
                sx={{
                  borderRadius: '8px',
                  color: 'primary.main',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
                IconComponent={KeyboardArrowDownIcon}
              >
                <MenuItem value="First Name">First Name</MenuItem>
                <MenuItem value="Last Name">Last Name</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setShowAddContactModal(true)}
            sx={{ fontWeight: 500, padding: '10px 36px' }}
          >
            Add Contact
          </Button>
        </Box>
        {data.length > 0 ? (
          <ContactListTable
            contacts={data}
            deleteContact={(contact) => handleSelectDeleteContact(contact)}
            // for edit
            handleDeleteContact={handleDeleteContact}
            addContact={addContact}
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
        text={`Are you sure you want to delete "${getContactDisplayName(
          selectedContactToDelete
        )}" from your contact list?`}
        onConfirm={handleDeleteContact}
        confirmButtonText="Delete"
        processing={processing}
      />
    </Container>
  );
};

export default Contacts;
