// React Imports
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Inrupt Imports
import { getWebIdDataset } from '@inrupt/solid-client';
// Material UI Imports
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import SendIcon from '@mui/icons-material/Send';
// Context Imports
import { DocumentListContext } from '@contexts';
// Custom Hook Imports
import useNotification from '../../hooks/useNotification';
// Component Imports
import { NewMessageModal } from '../Modals';
import { StyledTableCell, StyledTableRow } from '../Table/TableStyles';

/**
 * contactListTableRowProps is an object that stores the props for the
 * ContactListTableRow component
 *
 * @typedef {object} contactListTableRowProps
 * @property {object} contact - Object containing contact information
 * @property {Function} deleteContact
 * - function to delete a chosen contact
 */

/**
 * ContactListTableRow Component - Component that generates the individual table
 * rows of contacts from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTableRow
 * @param {contactListTableRowProps} Props - Props for ContactListTableRow
 * @returns {React.JSX.Element} The ContactListTableRow Component
 */
const ContactListTableRow = ({ contact, deleteContact }) => {
  const theme = useTheme();
  const [pinned, setPinned] = useState(false);
  const { setContact } = useContext(DocumentListContext);
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);

  // determine what icon gets rendered in the pinned column
  const pinnedIcon = pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />;

  // Event handler for pinning contact to top of table
  // ***** TODO: Add in moving pinned row to top of table
  const handlePinClick = () => {
    setPinned(!pinned);
  };

  // Event handler for profile page routing
  const handleSelectProfile = async (contactInfo) => {
    try {
      await getWebIdDataset(contactInfo.webId);
      setContact(contact);
    } catch {
      setContact(null);
      navigate('/contacts');
      addNotification('error', 'WebId does not exist');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        border: 1
      }}
    >
      <Card
        sx={{
          // border: 3,
          // margin: 3
          width: '100%'
        }}
      >
        {/* <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ margin: 1, padding: 1 }}
        <IconButton size="large" onClick={handlePinClick}>
          {pinnedIcon}
        </IconButton>
      </StyledTableCell>
      <StyledTableCell>
        <IconButton
          size="large"
          variant="contained"
          onClick={() => setShowModal(!showModal)}
        >
          <div
          // align="center"
          > */}
            <Link
              to={`/profile/${encodeURIComponent(contact.webId)}`}
              state={{ contact }}
              style={{
                textDecoration: 'none',
                color: theme.palette.primary.dark
              }}
            >
              <Button
                sx={{ textTransform: 'capitalize' }}
                onClick={() => handleSelectProfile(contact)}
              >
                {contact.person}
              </Button>
            </Link>
          </div>
          <Typography>(date added)</Typography>
          <div
            // align="center"
            style={
              {
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center'
              }
            }
          >
            <IconButton size="large" onClick={handlePinClick}>
              {pinnedIcon}
            </IconButton>
          </div>
          <div
          // align="center"
          >
            <IconButton size="large" onClick={() => deleteContact(contact)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </div>
        </Stack>
      </Card>
    </Box>
  );
};

export default ContactListTableRow;
