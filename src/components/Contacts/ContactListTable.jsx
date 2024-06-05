// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSendMessage = (contactId) => {
    setShowMessageModal(!showMessageModal);
    setMessageToField(isSmallScreen ? contactId.podUrl : contactId.value.podUrl);
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
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
      renderCell: (contactData) => <SendIcon onClick={() => handleProfileClick(contactData)} />,
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
    <Box
      sx={{
        margin: '20px 0',
        width: '90vw',
        height: '500px'
      }}
    >
      {isSmallScreen ? (
        <Box>
          {contacts?.map((contact) => (
            <Box key={contact.webId}>
              <Card
                sx={{
                  my: '5px'
                }}
              >
                <CardContent>
                  <Grid container alignItems="center">
                    <Grid item xs={9}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {contact.givenName || ''} {contact.familyName || ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {contact.webId}
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                      <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Grid>
                  </Grid>

                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button'
                    }}
                  >
                    <MenuItem
                      component={Button}
                      onClick={() => handleProfileClick(contact)}
                      startIcon={<ContactProfileIcon contact={contact} />}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      component={Button}
                      onClick={() => handleSendMessage(contact)}
                      startIcon={
                        <SendIcon
                          sx={{
                            color: '#808080',
                            cursor: 'pointer'
                          }}
                        />
                      }
                    >
                      Message
                    </MenuItem>
                    <MenuItem
                      component={Button}
                      onClick={() => deleteContact(contact)}
                      startIcon={<DeleteOutlineOutlinedIcon />}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </CardContent>
              </Card>
            </Box>
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
