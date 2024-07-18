// React Imports
import React, { useState } from 'react';

// Material UI Imports
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import { NewMessageModal, AddContactModal } from '../Modals';
import ContactListTableDesktop from './ContactListTableDesktop';
import ContactListTableMobile from './ContactListTableMobile';

/**
 * @typedef {import("../../typedefs.js").userListObject} userListObject
 */

/**
 * ContactListTable - Component that generates the list of contacts
 * from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {object} Props - Props for ContactListTable
 * @param {userListObject[]} Props.contacts - This list of contacts to display
 * @param {Function} Props.deleteContact - Method to delete contact
 * @param {Function} Props.handleDeleteContact - from Contacts page
 * @param {Function} Props.addContact - from Contacts page
 * @returns {React.JSX.Element} The ContactListTable Component
 */
const ContactListTable = ({ contacts, deleteContact, handleDeleteContact, addContact }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageToField, setMessageToField] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactToEdit, setContactToEdit] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSendMessage = (contactId) => {
    setShowMessageModal(!showMessageModal);
    setMessageToField(isSmallScreen ? contactId.podUrl : contactId.value.podUrl);
  };

  const handleEditContact = (contact) => {
    setShowAddContactModal(!showAddContactModal);
    setContactToEdit(contact);
    setIsEditing(true);
  };

  /*   const columnTitlesArray = [
    {
      field: 'First Name',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Last Name',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'webId',
      headerName: 'Web ID',
      minWidth: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Profile',
      renderCell: (contactData) => <ContactProfileIcon contact={contactData} />,
      sortable: false,
      filterable: false,
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Message',
      renderCell: (contactId) => (
        <SendIcon
          sx={{ color: 'gray', cursor: 'pointer' }}
          onClick={() => handleSendMessage(contactId)}
        />
      ),
      sortable: false,
      filterable: false,
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Edit',
      renderCell: (contactId) => (
        <EditIcon
          sx={{ color: 'gray', cursor: 'pointer' }}
          onClick={() => handleEditContact(contactId)}
        />
      ),
      sortable: false,
      filterable: false,
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Delete',
      width: 80,
      getActions: (contactData) => [
        <GridActionsCellItem
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => deleteContact(contactData.row.Delete)}
          label="Delete"
        />
      ]
    }
  ]; */

  const contactWebIds = contacts.map(({ webId }) => webId);

  return (
    <Box
      sx={{
        margin: '20px 0',
        width: '95vw',
        height: '500px'
      }}
    >
      {isSmallScreen ? (
        <ContactListTableMobile
          contacts={contacts}
          deleteContact={deleteContact}
          handleSendMessage={handleSendMessage}
          editContact={handleEditContact}
        />
      ) : (
        <ContactListTableDesktop
          contacts={contacts}
          deleteContact={deleteContact}
          handleSendMessage={handleSendMessage}
          editContact={handleEditContact}
        />
      )}
      <NewMessageModal
        showModal={showMessageModal}
        setShowModal={setShowMessageModal}
        toField={messageToField}
      />
      <AddContactModal
        showAddContactModal={showAddContactModal}
        contactToEdit={contactToEdit}
        isEditing={isEditing}
        setShowAddContactModal={setShowAddContactModal}
        addContact={addContact}
        deleteContact={deleteContact}
        handleDeleteContact={handleDeleteContact}
        contactWebIds={contactWebIds}
        contacts={contacts}
      />
    </Box>
  );
};

export default ContactListTable;
