// React Imports
import React, { useState } from 'react';
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
// Component Imports
import { StatusNotification } from '../Notification';


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


/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 */

const ClientListTable = ({
  userList,
  loadingActive,
  handleSelectUser,
  handleDeleteClient,
  state,
  statusType,
  defaultMessage
}) => {

  const theme = useTheme();
  // TODO: change from a state to a key/value field of the .ttl file (priority: true/false)
  const [pinned, setPinned] = useState(false);
  // TODO: determine better approach so all checkboxes don't get checked with a single one is checked.
  const [selected, setSelected] = useState(false);

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

  const handlePinClick = () => {
    // TODO: change from a state to a key/value field of the .ttl file (priority: true/false)
    // TODO: add function to move the row to the top of list if priority: true
    setPinned(!pinned);
  };

  // ======= MAKE ANY COLUMN HEADER CHANGES HERE =======
  const columnTitlesArray = ['Select', 'Client', 'WebID', 'Last Activity', 'Pin', 'Delete'];

  

  return (
    <TableContainer component={Paper} sx={{ marginTop: '3rem', marginBottom: '6rem' }}>
      <Table aria-label="client list table">
        <TableHead>
          <TableRow>
            {columnTitlesArray.map((columnTitle) => (
              <StyledTableCell align="center">{columnTitle}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.map((client, index) => {
            const labelId = `clientlist-checkbox-${index}`;
            return (
            <StyledTableRow key={client.podUrl}>
              <StyledTableCell align="center">
                <Checkbox
                  color="primary"
                  // TODO: determine better approach so all checkboxes don't get checked with a single one is checked.
                  checked={selected}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                  onClick={() => {
                    setSelected(!selected);
                    handleSelectUser(client.person, client.podUrl);
                  }}
                />
              </StyledTableCell>
              <StyledTableCell align="center" id={labelId}>{client.person}</StyledTableCell>
              <StyledTableCell align="center">
                <Link
                  href={client.podUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
                >
                  {client.podUrl}
                </Link>
              </StyledTableCell>
              <StyledTableCell align="center">{determineDateModifiedCell(client)}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton size="large" edge="end" onClick={handlePinClick}>
                  {/* TODO: change from a state to a key/value field of the .ttl file (priority: true/false) */}
                  {pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />}
                </IconButton>
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  size="large"
                  edge="end"
                  onClick={() => handleDeleteClient(client.person, client.givenName, client.podUrl)}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
            );
          })}
        </TableBody>
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
