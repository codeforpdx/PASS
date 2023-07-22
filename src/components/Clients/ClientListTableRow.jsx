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
import { StyledTableCell, StyledTableRow } from '../Table/TableStyles';
import { DocumentListContext } from '../../contexts';

/**
 * @typedef {import("../../typedefs.js").clientListTableRowProps} clientListTableRowProps
 */

/**
 * ClientListTableRow Component - Component that generates the individual table
 * rows of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTableRow
 * @param {clientListTableRowProps} Props - Props for ClientListTableRow
 * @returns {React.JSX.Element} The ClientListTableRow Component
 */
const ClientListTableRow = ({
  labelId,
  client,
  setShowDeleteClientModal,
  setSelectedClientToDelete
}) => {
  const theme = useTheme();
  const [pinned, setPinned] = useState(false);
  const { setClient } = useContext(DocumentListContext);

  // determine what icon gets rendered in the pinned column
  const pinnedIcon = pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />;

  // Event handler for pinning client to top of table
  // ***** TODO: Add in moving pinned row to top of table
  const handlePinClick = () => {
    setPinned(!pinned);
  };

  // Event handler for deleting a client from client list
  const handleSelectClientToDelete = () => {
    setSelectedClientToDelete(client);
    setShowDeleteClientModal(true);
  };

  return (
    <StyledTableRow id={labelId}>
      <StyledTableCell align="center">{client.person}</StyledTableCell>
      <StyledTableCell align="center">
        <Link
          to={`/clients/${encodeURIComponent(client.webId)}`}
          state={{ client }}
          style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
        >
          <Button sx={{ textTransform: 'capitalize' }} onClick={() => setClient(client)}>
            Link to Profile
          </Button>
        </Link>
      </StyledTableCell>
      <StyledTableCell align="center">
        <IconButton size="large" edge="end" onClick={handlePinClick}>
          {pinnedIcon}
        </IconButton>
      </StyledTableCell>
      <StyledTableCell align="center">
        <IconButton size="large" edge="end" onClick={handleSelectClientToDelete}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ClientListTableRow;
