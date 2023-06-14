// React Imports
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import { styled, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import IconButton from '@mui/material/IconButton';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
// Utility Imports
import { runNotification, getDocTTLs } from '../../utils';
// Context Imports
import { SelectUserContext, UserListContext } from '../../contexts';
// Component Imports
import { ShowDocumentsModal } from '../DocumentModals';

/**
 * ClientListTableRow Component - Component that generates the individual table
 * rows of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTableRow
 */

// determine what gets rendered in the table body
const ClientListTableRow = ({ labelId, client, state, dispatch }) => {
  const theme = useTheme();
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const { removeUser } = useContext(UserListContext);
  const [pinned, setPinned] = useState(false);

  // determine what gets rendered in the date modified cell of table
  const modifiedDate = client.dateModified
    ? client.dateModified.toLocaleDateString()
    : 'Not available';

  // determine what icon gets rendered in the pinned column
  const pinnedIcon = pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />;

  // Event handler for selecting client from client list
  const handleSelectClient = async (clientToSelect) => {
    if (clientToSelect.webId === selectedUser.webId) {
      runNotification(`Client "${clientToSelect.person}" unselected.`, 3, state, dispatch);
      setSelectedUser({});
      return;
    }

    runNotification(`Client "${clientToSelect.person}" selected.`, 3, state, dispatch);
    setSelectedUser(clientToSelect);
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

  // EXPERIMENTAL - Event handler for displaying Documents from PASS
  const { session } = useSession();
  const [fileSrc, setFileSrc] = useState([]);
  const [showDocument, setShowDocument] = useState(false);

  const handleShowFile = async () => {
    runNotification('Fetching documents from Pod...', 5, state, dispatch);
    dispatch({ type: 'SET_PROCESSING' });

    const allPermittedData = await getDocTTLs(session, client.podUrl);
    if (allPermittedData.length === 0) {
      setFileSrc([]);
      runNotification(
        'Operation failed. Reason: No access to files or no documents found.',
        5,
        state,
        dispatch
      );
      dispatch({ type: 'CLEAR_PROCESSING' });
      return;
    }

    setFileSrc(allPermittedData);
    setShowDocument(!showDocument);

    setTimeout(() => {
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 5000);
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
        <Link
          to={client.webId}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
        >
          {client.webId}
        </Link>
      </StyledTableCell>
      <StyledTableCell align="center">{modifiedDate}</StyledTableCell>
      <StyledTableCell align="center">
        <IconButton disabled={state.processing} size="large" edge="end" onClick={handleShowFile}>
          <FindInPageIcon />
        </IconButton>
        <ShowDocumentsModal
          showModal={showDocument}
          setShowModal={setShowDocument}
          fileSrc={fileSrc}
        />
      </StyledTableCell>
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
