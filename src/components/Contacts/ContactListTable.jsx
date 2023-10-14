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
 * contactListTableProps is an object that stores the props for the
 * ContactListTable component
 *
 * @typedef {object} contactListTableProps
 * @property {Array} contacts - the list of contacts to be displayed
 * @property {Function} deleteContact - method to delete contact from list
 * @memberof typedefs
 */

/**
 * ContactListTable Component - Component that generates the list of contacts
 * from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {contactListTableProps} Props - Props for ContactListTable
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
      field: 'Contact',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      sortable: false
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
          Contact: contact.person,
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
