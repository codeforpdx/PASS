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
 * @property {Array} contacts - this list of contacts to display
 * @property {Function} deleteContact - method to delete contact
 * @memberof typedefs
 */

/**
 * ContactListTable Component - Component that generates table of contacts from data within ContactList
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
    { field: 'Contact', width: 120 },
    {
      field: 'Profile',
      renderCell: (contactData) => <ContactProfileIcon contact={contactData} />,
      sortable: false,
      filterable: false
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (contactData) => [
        <GridActionsCellItem
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => deleteContact(contactData.row.Delete)}
        />
      ]
    }
  ];

  return (
    <Box sx={{ mt: 2 }}>
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
        slotProps={{ columnMenu: { background: 'red' } }}
      />
    </Box>
  );
};

export default ContactListTable;
