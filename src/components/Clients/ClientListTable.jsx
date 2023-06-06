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

/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 */

const ClientListTable = ({ loadingActive, statusType, defaultMessage }) => {
  const { state } = useStatusNotification();
  const { userListObject } = useContext(UserListContext);
  const columnTitlesArray = ['Select', 'Client', 'WebID', 'Last Activity', 'Pin', 'Delete'];

  // determine what gets rendered in the table head
  const tableHead = () => (
    <TableHead>
      <TableRow>
        {columnTitlesArray.map((columnTitle) => (
          <StyledTableCell key={columnTitle} align="center">
            {columnTitle}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  // determine what gets rendered in the table body
  const tableBody = () => (
    <TableBody>
      {userListObject?.userList.map((client, index) => {
        const labelId = `clientlist-checkbox-${index}`;
        return (
          <ClientListTableRow
            key={client.webId}
            loadingActive={loadingActive}
            labelId={labelId}
            client={client}
          />
        );
      })}
    </TableBody>
  );

  // ======= MAIN RENDER/DISPLAY OF COMPONENT =======
  return (
    <TableContainer component={Paper} sx={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <Table aria-label="client list table">
        {tableHead()}
        {tableBody()}
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
