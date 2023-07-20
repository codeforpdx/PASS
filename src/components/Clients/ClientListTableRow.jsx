// React Imports
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
// Utility Imports
import { runNotification } from '../../utils';
// Context Imports
import { SelectedUserContext } from '../../contexts';
import { StyledTableCell, StyledTableRow } from '../Table/TableStyles';
import { fetchProfileInfo } from '../../model-helpers';

/**
 * ClientListTableRow Component - Component that generates the individual table
 * rows of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTableRow
 */

// determine what gets rendered in the table body
const ClientListTableRow = ({
  labelId,
  client,
  state,
  dispatch,
  setShowDeleteClientModal,
  setSelectedClientToDelete
}) => {
  const theme = useTheme();
  const { session } = useSession();
  const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);
  const [pinned, setPinned] = useState(false);

  // determine what icon gets rendered in the pinned column
  const pinnedIcon = pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />;

  // Event handler for selecting client from client list
  const handleSelectClient = async (clientToSelect) => {
    if (clientToSelect.webId === selectedUser.webId) {
      runNotification(`Client "${clientToSelect.person}" unselected.`, 3, state, dispatch);
      setSelectedUser();
      return;
    }

    runNotification(`Client "${clientToSelect.person}" selected.`, 3, state, dispatch);
    const profileData = await fetchProfileInfo(session, clientToSelect.webId);
    setSelectedUser({ ...clientToSelect, ...profileData.profileInfo });
  };

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
    <StyledTableRow>
      <StyledTableCell align="center">
        <Checkbox
          id={labelId}
          color="primary"
          checked={selectedUser.webId === client.webId}
          inputProps={{
            'aria-labelledby': labelId
          }}
          onClick={() => {
            handleSelectClient(client);
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="center">{client.person}</StyledTableCell>
      {/* ***** TODO: Switch this webId to being a small Notes section */}
      {/* seems having a link or even displaying another user's pod is completely useless/irrelevant */}
      {/* see no reason it would ever need to be used, but notes/comments will be of utmost importance to caseworkers */}
      <StyledTableCell align="center">
        {selectedUser.webId === client.webId ? (
          <Link
            to="/PASS/clients/profile"
            style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
          >
            Link to Pod Profile
          </Link>
        ) : (
          <p style={{ opacity: 0.5 }}>Link to Pod Profile</p>
        )}
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
