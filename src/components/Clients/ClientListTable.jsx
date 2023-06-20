// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
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
import { StyledTableCell } from '../Table/TableStyles';

// ===== MAKE CHANGES HERE FOR TABLE HEADER / COLUMN TITLES =====
const columnTitlesArray = ['Select', 'Client', 'WebID', 'Last Activity', 'Pin', 'Delete'];

/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 */

const ClientListTable = ({ statusType, defaultMessage }) => {
  const { state, dispatch } = useStatusNotification();
  const { userListObject } = useContext(UserListContext);


  function comparePerson(a, b) {
    if (a.person < b.person) {
      return -1
    }
    if (a.person > b.person) {
      return 1
    }
    return 0
  }
  
  const sortedUserListObject = userListObject.userList.sort(comparePerson)

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
