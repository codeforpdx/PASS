// React Imports
import React, { useState, useEffect } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
// MUI Theme
import { AddContactModal, NewMessageModal } from '@components/Modals';
import theme from '../../theme';
// Component Imports
import ContactProfileIcon from './ContactProfileIcon';

// to do: open a modal like in message button. modal should have contact data.

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
);

/**
 * @typedef {import("../../typedefs.js").userListObject} userListObject
 */

/**
 * ContactListTable Component - Component that generates the list of contacts
 * from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {object} Props - Props for ContactListTable
 * @param {userListObject[]} Props.contacts - this list of contacts to display
 * @param {Function} Props.deleteContact - method to delete contact
 * @param Props.refresh
 * @param Props.setRefresh
 * @param {Function} Props.handleDeleteContact - from Contacts page
 * @param {Function} Props.addContact - from Contacts page
 * @returns {React.JSX.Element} The ContactListTable Component
 */
const ContactListTable = ({ contacts, deleteContact, handleDeleteContact, addContact, refresh, setRefresh }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageToField, setMessageToField] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactToEdit, setContactToEdit] = useState({});
  const [contacts_, setContacts] = useState(contacts);


  useEffect(() => {
      setContacts(contacts_);
      console.log('Contact list table refreshed');
  }, [contacts_]);

  const handleSendMessage = (contactId) => {
    setShowMessageModal(!showMessageModal);
    setMessageToField(contactId.value.podUrl);
  };

  const handleEditContact = (contactId) => {
    setShowAddContactModal(!showAddContactModal);
    setContactToEdit(contactId.value);
  };

  const columnTitlesArray = [
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
      renderCell: (contactId) => <EditIcon onClick={() => handleEditContact(contactId)} />,
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
  ];

  const contactWebIds = contacts.map(({ webId }) => webId);

  return (
    <Box sx={{ margin: '20px 0', width: '90vw', height: '500px' }}>
      <DataGrid
        columns={columnTitlesArray}
        rows={contacts?.map((contact) => ({
          id: contact.webId,
          'First Name': contact.givenName || '',
          'Last Name': contact.familyName || '',
          webId: contact.webId,
          Profile: contact,
          Message: contact,
          Edit: contact,
          Delete: contact
        }))}
        slots={{
          toolbar: CustomToolbar
        }}
        sx={{
          '.MuiDataGrid-columnHeader': {
            background: theme.palette.primary.light,
            color: 'white'
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none'
          }
        }}
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 }
          },
          sorting: {
            sortModel: [{ field: 'webId', sort: 'asc' }]
          }
        }}
        disableColumnMenu
        disableRowSelectionOnClick
      />
      <NewMessageModal
        showModal={showMessageModal}
        setShowModal={setShowMessageModal}
        toField={messageToField}
      />
      {/* For editing contact */}
      <AddContactModal
        showAddContactModal={showAddContactModal}
        contactToEdit={contactToEdit}
        setShowAddContactModal={setShowAddContactModal}
        addContact={addContact}
        deleteContact={deleteContact}
        handleDeleteContact={handleDeleteContact}
        contactWebIds={contactWebIds}
        contacts={contacts}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </Box>
  );
};

export default ContactListTable;
