// React Imports
import React, { useState } from 'react';
// Material UI Imports
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// Component Imports
import { useDataset, useSession } from '@hooks';
import { AddContactModal, DeleteContactModal } from '@components/Modals';
import { ContactListTable } from '@components/Contacts';
import { LoadingAnimation, EmptyListNotification } from '@components/Notification';
import { getStringNoLocale, getThingAll, getUrl } from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';

/**
 * Contacts Component - Component that generates Contacts Page for PASS
 *
 * @memberof Pages
 * @name Contacts
 */

const Contacts = () => {
  localStorage.setItem('restorePath', '/clients');
  // state for AddContactModal component
  const { session, podUrl } = useSession();
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [selectedContactToDelete, setSelectedContactToDelete] = useState(null);

  const parseContacts = (data) => {
    const contactThings = getThingAll(data);
    const contacts = [];
    contactThings.forEach((thing) => {
      const contact = {};

      contact.webId = getUrl(thing, RDF_PREDICATES.identifier);
      contact.podUrl = getUrl(thing, RDF_PREDICATES.URL);
      contact.givenName = getStringNoLocale(thing, RDF_PREDICATES.givenName);
      contact.familyName = getStringNoLocale(thing, RDF_PREDICATES.familyName);
      contacts.push(contact);
    });
    return contacts;
  };

  const { data, isLoading, isError, error } = useDataset(
    new URL('PASS/Users/userlist.ttl', podUrl),
    session.fetch
  );

  if (isLoading) return <LoadingAnimation loadingItem="clients" />;
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
        {getThingAll(data).length > 0 ? (
          <ContactListTable
            setSelectedContactToDelete={setSelectedContactToDelete}
            setShowDeleteContactModal={setShowDeleteContactModal}
            contacts={parseContacts(data)}
          />
        ) : (
          <EmptyListNotification type="clients" />
        )}
      </Box>

      {/* modal/popup renders when showAddContactModal state is true */}
      <AddContactModal
        showAddContactModal={showAddContactModal}
        setShowAddContactModal={setShowAddContactModal}
      />
      <DeleteContactModal
        showDeleteContactModal={showDeleteContactModal}
        setShowDeleteContactModal={setShowDeleteContactModal}
        selectedContactToDelete={selectedContactToDelete}
      />
    </Container>
  );
};

export default Contacts;
