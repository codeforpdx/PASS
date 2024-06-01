// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
// Component Imports
import ContactProfileIcon from './ContactProfileIcon';
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
 * ContactListTable - Component that generates the list of contacts
 * from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {object} Props - Props for ContactListTable
 * @param {userListObject[]} Props.contacts - This list of contacts to display
 * @param {Function} Props.deleteContact - Method to delete contact
 * @returns {React.JSX.Element} The ContactListTable Component
 */
const ContactListTable = ({ contacts, deleteContact }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageToField, setMessageToField] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSendMessage = (contactId) => {
    setShowMessageModal(!showMessageModal);
    setMessageToField(isSmallScreen ? contactId.podUrl : contactId.value.podUrl);
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
          sx={{ color: '#808080', cursor: 'pointer' }}
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
      {isSmallScreen ? (
        <Box>
          {contacts?.map((contact) => (
            <Card key={contact.webId} sx={{ my: '15px', p: '15px' }}>
              <Typography>
                {contact.givenName || ''} {contact.familyName || ''}
              </Typography>
              <Typography>{contact.webId}</Typography>
              <ButtonGroup
                variant="text"
                direction="horizontal"
                aria-label="Basic button group"
                fullWidth
              >
                <Button>
                  <ContactProfileIcon contact={contact} />
                </Button>
                <Button onClick={() => handleSendMessage(contact.podUrl)}>
                  <SendIcon sx={{ color: '#808080', cursor: 'pointer' }} />
                </Button>
                <Button>
                  <DeleteOutlineOutlinedIcon />
                </Button>
              </ButtonGroup>
            </Card>
          ))}
        </Box>
      ) : (
        <DataGrid
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
      )}
      <NewMessageModal
        showModal={showMessageModal}
        setShowModal={setShowMessageModal}
        toField={messageToField}
      />
    </Box>
  );
};

export default ContactListTable;
