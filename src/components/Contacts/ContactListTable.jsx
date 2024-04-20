// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendIcon from '@mui/icons-material/Send';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
// MUI Theme
import theme from '../../theme';
// Component Imports
import ContactAccountIcon from './ContactAccountIcon';
import { NewMessageModal } from '../Modals';

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
 * @returns {React.JSX.Element} The ContactListTable Component
 */
const ContactListTable = ({ contacts, deleteContact }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageToField, setMessageToField] = useState('');

  const handleSendMessage = (contactId) => {
    setShowMessageModal(!showMessageModal);
    setMessageToField(contactId.value.podUrl);
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
      field: 'Account',
      renderCell: (contactData) => <ContactAccountIcon contact={contactData} />,
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

  return (
    <Box sx={{ margin: '20px 0', width: '90vw', height: '500px' }}>
      <DataGrid
        columns={columnTitlesArray}
        rows={contacts?.map((contact) => ({
          id: contact.webId,
          'First Name': contact.givenName || '',
          'Last Name': contact.familyName || '',
          webId: contact.webId,
          Account: contact,
          Message: contact,
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
    </Box>
  );
};

export default ContactListTable;
