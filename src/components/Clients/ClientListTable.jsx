// React Imports
import React, { useState, useContext } from 'react';
// React Router Imports
import { Link } from 'react-router-dom';
// Material UI Imports
import { styled, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
// Utility Imports
import { runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext, UserListContext } from '../../contexts';
// Component Imports
import { StatusNotification } from '../Notification';

/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 */

const ClientListTable = ({ loadingActive, statusType, defaultMessage }) => {
  const theme = useTheme();
  const { state, dispatch } = useStatusNotification();
  const { setSelectedUser } = useContext(SelectUserContext);
  const { userListObject, removeUser } = useContext(UserListContext);
  // ***** TODO: change from a state to a key/value field of the .ttl file (priority: true/false)
  const [pinned, setPinned] = useState(false);
  // ***** TODO: determine better approach so all checkboxes don't get checked with a single one is checked
  const [selected, setSelected] = useState(false);
  // ======= MAKE ANY COLUMN HEADER CHANGES HERE =======
  const columnTitlesArray = ['Select', 'Client', 'WebID', 'Last Activity', 'Pin', 'Delete'];

  // Event handler for selecting client from client list
  const handleSelectClient = async (clientToSelect, selectedClientUrl) => {
    runNotification(`Client "${clientToSelect}" selected.`, 3, state, dispatch);
    setSelectedUser(selectedClientUrl.split('/')[2].split('.')[0]);
  };

  // Event handler for deleting client from client list
  const handleDeleteClient = async (client) => {
    if (
      !window.confirm(
        `You're about to delete ${client.person} from your client list, do you wish to continue?`
      )
    ) {
      return;
    }
    runNotification(`Deleting "${client.person}" from client list...`, 3, state, dispatch);
    await removeUser(client);
    runNotification(`"${client.person}" deleted from client list...`, 3, state, dispatch);
  };

  // Event handler for pinning client to top of table
  const handlePinClick = () => {
    // ***** TODO: change from a state to a key/value field of the .ttl file (priority: true/false)
    // ***** TODO: add function to move the row to the top of list if priority: true
    setPinned(!pinned);
  };

  // determine what gets rendered in the table head
  const columnTitles = columnTitlesArray.map((columnTitle) => (
    <StyledTableCell key={columnTitle} align="center">
      {columnTitle}
    </StyledTableCell>
  ));

  // determine what icon gets rendered in the pinned column
  // ***** TODO: change from a state to a key/value field of the .ttl file (priority: true/false)
  const pinnedIcon = pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />;

  // determine what gets rendered in the date modified cell of table
  const determineDateModifiedCell = (client) => {
    let displayed;
    if (loadingActive) {
      displayed = 'Loading...';
    } else if (client.dateModified) {
      displayed = client.dateModified.toLocaleDateString();
    } else {
      displayed = 'Not available';
    }
    return displayed;
  };

  // determine what gets rendered in the table body
  const tableCells = userListObject?.userList.map((client, index) => {
    const labelId = `clientlist-checkbox-${index}`;
    return (
      <StyledTableRow key={client.webId}>
        <StyledTableCell align="center">
          <Checkbox
            color="primary"
            // ***** TODO: determine better approach so all checkboxes don't get checked when a single box is checked.
            checked={selected}
            inputProps={{
              'aria-labelledby': labelId
            }}
            onClick={() => {
              setSelected(!selected);
              handleSelectClient(client.person, client.podUrl);
            }}
          />
        </StyledTableCell>
        <StyledTableCell align="center" id={labelId}>
          {client.person}
        </StyledTableCell>
        {/* ***** TODO: Switch this webId to being a small Notes section */}
        {/* seems having a link or even displaying another user's pod is completely useless/irrelevant */}
        {/* see no reason it would ever need to be used, but notes/comments will be of utmost importance to caseworkers */}
        <StyledTableCell align="center">
          <Link
            href={client.webId}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
          >
            {client.webId}
          </Link>
        </StyledTableCell>
        <StyledTableCell align="center">{determineDateModifiedCell(client)}</StyledTableCell>
        <StyledTableCell align="center">
          <IconButton size="large" edge="end" onClick={handlePinClick}>
            {/* ***** TODO: change from a state to a key/value field of the .ttl file (priority: true/false) */}
            {pinnedIcon}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">
          <IconButton size="large" edge="end" onClick={() => handleDeleteClient(client)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
    );
  });

  // ======= MAIN RENDER/DISPLAY OF COMPONENT =======
  return (
    <TableContainer component={Paper} sx={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <Table aria-label="client list table">
        <TableHead>
          <TableRow>{columnTitles}</TableRow>
        </TableHead>
        <TableBody>{tableCells}</TableBody>
      </Table>
      <StatusNotification
        notification={state.message}
        statusType={statusType}
        defaultMessage={defaultMessage}
        locationUrl={state.documentUrl}
      />
    </TableContainer>
  );
};

export default ClientListTable;

// ======= TABLE STYLING STARTS HERE =======
// ***** TODO: Switch this styled components to MUI

// styling for table cells
const StyledTableCell = styled(TableCell)(() => {
  const theme = useTheme();
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  };
});

// styling for table rows
const StyledTableRow = styled(TableRow)(() => {
  const theme = useTheme();
  return {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.primary.slight
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  };
});
