// React Imports
import React from 'react';
// Material UI Imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import SendIcon from '@mui/icons-material/Send';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
// Component Imports
import ContactProfileIcon from './ContactProfileIcon';
// Theme Imports
import theme from '../../theme';

const MUIDataGridStyling = {
  '.MuiDataGrid-columnHeader': {
    background: theme.palette.primary.main,
    color: 'white'
  },
  '.MuiDataGrid-columnSeparator': {
    display: 'none'
  }
};

// Custom toolbar for the DataGrid
const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
);

/**
 * @typedef {object} Contact
 * @property {string} webId - The Web ID of the contact
 * @property {string} givenName - The given name of the contact
 * @property {string} familyName - The family name of the contact
 */

/**
 * ContactListTableDesktop - Component for displaying contacts in a DataGrid
 *
 * @memberof Contacts
 * @name ContactListTableDesktop
 * @param {object} Props - The props for ContactListTableDesktop
 * @param {Contact[]} Props.contacts - The list of contacts to display
 * @param {Function} Props.deleteContact - Function to delete a contact
 * @param {Function} Props.editContact - Function to edit a contact
 * @param {Function} Props.handleSendMessage - Function to handle sending a message
 * @param {string} Props.'data-testid' - Test ID
 * @returns {React.JSX.Element} The ContactListTableDesktop component
 */
const ContactListTableDesktop = ({
  contacts,
  deleteContact,
  editContact,
  handleSendMessage,
  'data-testid': dataTestId
}) => {
  // const theme = useTheme();

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
      minWidth: 80,
      maxWidth: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Message',
      renderCell: (contactId) => (
        <SendIcon
          sx={{ color: '#808080', cursor: 'pointer' }}
          onClick={() => handleSendMessage(contactId)}
        />
      ),
      sortable: false,
      filterable: false,
      minWidth: 80,
      maxWidth: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Edit',
      renderCell: (contact) => (
        <EditOutlined
          sx={{ color: 'gray', cursor: 'pointer' }}
          onClick={() => editContact(contact.row.Profile)}
        />
      ),
      sortable: false,
      filterable: false,
      minWidth: 80,
      maxWidth: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Delete',
      minWidth: 80,
      maxWidth: 80,
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
    <DataGrid
      data-testid={dataTestId}
      columns={columnTitlesArray}
      rows={contacts?.map((contact) => ({
        id: contact.webId,
        'First Name': contact.givenName || '',
        'Last Name': contact.familyName || '',
        webId: contact.webId,
        Profile: contact,
        Message: contact,
        Delete: contact
      }))}
      slots={{
        toolbar: CustomToolbar
      }}
      sx={MUIDataGridStyling}
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
  );
};

export default ContactListTableDesktop;
