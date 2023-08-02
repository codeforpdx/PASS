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
import {
  getStringNoLocale,
  getThing,
  removeThing,
  getThingAll,
  getUrl,
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Contacts Component - Component that generates Contacts Page for PASS
 *
 * @memberof Pages
 * @name Contacts
 */

const Contacts = () => {
  localStorage.setItem('restorePath', '/contacts');
  // state for AddContactModal component
  const { session, podUrl } = useSession();
  const listUrl = new URL('PASS/Users/userlist.ttl', podUrl);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [selectedContactToDelete, setSelectedContactToDelete] = useState(null);
  const queryClient = useQueryClient();

  const handleSelectDeleteContact = (contact) => {
    setSelectedContactToDelete(contact);
    setShowDeleteContactModal(true);
  };

  const parseContacts = (data) => {
    const contactThings = getThingAll(data);
    const contacts = [];
    contactThings.forEach((thing) => {
      const contact = {};

      contact.webId = getUrl(thing, RDF_PREDICATES.identifier);
      contact.podUrl = getUrl(thing, RDF_PREDICATES.URL);
      contact.givenName = getStringNoLocale(thing, RDF_PREDICATES.givenName);
      contact.familyName = getStringNoLocale(thing, RDF_PREDICATES.familyName);
      contact.username = getStringNoLocale(thing, RDF_PREDICATES.alternateName);
      contact.person = getStringNoLocale(thing, RDF_PREDICATES.Person);
      contacts.push(contact);
    });
    return contacts;
  };

  const { data, isLoading, isError, error } = useDataset(
    listUrl.toString(),
    session.fetch,
    true
  );

  const saveData = async (dataset) => {
    const savedDataset = await saveSolidDatasetAt(listUrl.toString(), dataset, {
      fetch: session.fetch
    });
    return savedDataset;
  };

  const makeContactIntoThing = ({ username, givenName, familyName, webId }) =>
    buildThing(createThing({ name: username }))
      .addStringNoLocale(RDF_PREDICATES.Person, `${givenName} ${familyName}`)
      .addStringNoLocale(RDF_PREDICATES.givenName, givenName)
      .addStringNoLocale(RDF_PREDICATES.familyName, familyName)
      .addStringNoLocale(RDF_PREDICATES.alternateName, username)
      .addUrl(RDF_PREDICATES.identifier, webId)
      .addUrl(RDF_PREDICATES.URL, webId.split('profile')[0])
      .build();

  const addContact = useMutation({
    mutationFn: async (newContact) => {
      const thing = makeContactIntoThing(newContact);
      const newDataset = setThing(data, thing);
      const savedDataset = await saveData(newDataset);
      return savedDataset;
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([listUrl.toString()], () => resData);
    }
  });

  const deleteContact = useMutation({
    mutationFn: async (contactToDelete) => {
      const thingUrl = `${listUrl.toString()}#${contactToDelete.username}`;
      const thingToRemove = getThing(data, thingUrl);
      const newDataset = removeThing(data, thingToRemove);
      const savedDataset = await saveData(newDataset);
      return savedDataset;
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([listUrl.toString()], () => resData);
    }
  });

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
            contacts={parseContacts(data)}
            deleteContact={(contact) => handleSelectDeleteContact(contact)}
          />
        ) : (
          <EmptyListNotification type="clients" />
        )}
      </Box>

      {/* modal/popup renders when showAddContactModal state is true */}
      <AddContactModal
        showAddContactModal={showAddContactModal}
        setShowAddContactModal={setShowAddContactModal}
        addContact={addContact.mutate}
      />
      <DeleteContactModal
        showDeleteContactModal={showDeleteContactModal}
        setShowDeleteContactModal={setShowDeleteContactModal}
        selectedContactToDelete={selectedContactToDelete}
        deleteContact={deleteContact.mutate}
      />
    </Container>
  );
};

export default Contacts;
