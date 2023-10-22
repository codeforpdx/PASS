// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
import ContactProfileIcon from './ContactProfileIcon';

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
  const comparePerson = (a, b) => {
    if (a.familyName[0].toLowerCase() < b.familyName[0].toLowerCase()) {
      return -1;
    }
    if (a.familyName[0].toLowerCase() > b.familyName[0].toLowerCase()) {
      return 1;
    }
    return 0;
  };
  const contactsCopy = [...contacts];
  const sortedContacts = contactsCopy.sort(comparePerson);

  const columnTitlesArray = [
    {
      field: 'First Name',
      width: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Last Name',
      width: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Profile',
      renderCell: (contactData) => <ContactProfileIcon contact={contactData} />,
      sortable: false,
      filterable: false,
      width: 70,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      type: 'actions',
      width: 70,
      getActions: (contactData) => [
        <GridActionsCellItem
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => deleteContact(contactData.row.Delete)}
        />
      ]
    }
  ];

  return (
    <Box sx={{ margin: '20px 0' }}>
      <DataGrid
        columns={columnTitlesArray}
        rows={sortedContacts?.map((contact) => ({
          id: contact.webId,
          'First Name': contact.givenName,
          'Last Name': contact.familyName,
          Profile: contact,
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
          }
        }}
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default ContactListTable;
