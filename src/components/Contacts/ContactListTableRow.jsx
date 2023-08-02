// React Imports
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { StyledTableCell, StyledTableRow } from '../Table/TableStyles';

/**
 * @typedef {import("../../typedefs.js").contactListTableRowProps} contactListTableRowProps
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

  // determine what icon gets rendered in the pinned column
  const pinnedIcon = pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />;

  // Event handler for pinning contact to top of table
  // ***** TODO: Add in moving pinned row to top of table
  const handlePinClick = () => {
    setPinned(!pinned);
  };

  return (
    <StyledTableRow>
      <StyledTableCell align="center">
        <Link
          to={`/profile/${encodeURIComponent(contact.webId)}`}
          state={{ contact }}
          style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
        >
          <Button sx={{ textTransform: 'capitalize' }} onClick={() => setContact(contact)}>
            {`${contact.givenName} ${contact.familyName}`}
          </Button>
        </Link>
      </StyledTableCell>
      <StyledTableCell
        align="center"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <IconButton size="large" onClick={handlePinClick}>
          {pinnedIcon}
        </IconButton>
      </StyledTableCell>
      <StyledTableCell align="center">
        <IconButton size="large" onClick={() => deleteContact(contact)}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ContactListTableRow;
