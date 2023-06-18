// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { UserListContext } from '../../contexts';
// Component Imports
import { StatusNotification } from '../Notification';
import ClientListTableRow from './ClientListTableRow';

// ===== MAKE CHANGES HERE FOR TABLE HEADER / COLUMN TITLES =====
const columnTitlesArray = ['Select', 'Client', 'WebID', 'Pin', 'Delete'];

/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 */

const ClientListTable = ({ statusType, defaultMessage }) => {
  const { state, dispatch } = useStatusNotification();
  const { userListObject } = useContext(UserListContext);

  return (
    <TableContainer component={Paper} sx={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <Table aria-label="client list table">
        <TableHead>
          <TableRow>
            {columnTitlesArray.map((columnTitle) => (
              <StyledTableCell key={columnTitle} align="center">
                {columnTitle}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {userListObject?.userList.map((client, index) => {
            const labelId = `clientlist-checkbox-${index}`;
            return (
              <ClientListTableRow
                key={client.webId}
                labelId={labelId}
                client={client}
                state={state}
                dispatch={dispatch}
              />
            );
          })}
        </TableBody>
      </Table>
      <StatusNotification state={state} statusType={statusType} defaultMessage={defaultMessage} />
    </TableContainer>
  );
};

export default ClientListTable;

// ***** TODO: Switch this styled component to MUI
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
