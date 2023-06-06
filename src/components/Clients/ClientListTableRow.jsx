// React Imports
import React, { useState, useContext } from 'react';
// React Router Imports
import { Link } from 'react-router-dom';
// Material UI Imports
import { styled, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
// Utility Imports
import { runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext, UserListContext } from '../../contexts';


// determine what gets rendered in the table body
const ClientListTableRow = ({ loadingActive, labelId, client }) => {
  const theme = useTheme();
  const { state, dispatch } = useStatusNotification();
  const { setSelectedUser } = useContext(SelectUserContext);
  const { removeUser } = useContext(UserListContext);
  const [pinned, setPinned] = useState(false);
  const [selected, setSelected] = useState(false);

  // determine what gets rendered in the date modified cell of table
  const determineDateModifiedCell = () => {
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

  // determine what icon gets rendered in the pinned column
  const pinnedIcon = pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />;

  // Event handler for selecting client from client list
  const handleSelectClient = async (clientToSelect, selectedClientUrl) => {
    runNotification(`Client "${clientToSelect}" selected.`, 3, state, dispatch);
    setSelectedUser(selectedClientUrl.split('/')[2].split('.')[0]);
  };

  // Event handler for deleting client from client list
  const handleDeleteClient = async () => {
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
  // ***** TODO: Add in moving pinned row to top of table
  const handlePinClick = () => {
    setPinned(!pinned);
  };

  return (
    <StyledTableRow>
      <StyledTableCell align="center">
        <Checkbox
          color="primary"
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
          to={client.webId}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
        >
          {client.webId}
        </Link>
      </StyledTableCell>
      <StyledTableCell align="center">{determineDateModifiedCell()}</StyledTableCell>
      <StyledTableCell align="center">
        <IconButton size="large" edge="end" onClick={handlePinClick}>
          {pinnedIcon}
        </IconButton>
      </StyledTableCell>
      <StyledTableCell align="center">
        <IconButton size="large" edge="end" onClick={() => handleDeleteClient()}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ClientListTableRow;


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
