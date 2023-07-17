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
import ClientListTableRow from './ClientListTableRow';
import { StyledTableCell } from '../Table/TableStyles';

// ===== MAKE CHANGES HERE FOR TABLE HEADER / COLUMN TITLES =====
const columnTitlesArray = ['Select', 'Client', 'WebID', 'Pin', 'Delete'];

/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 */

const ClientListTable = ({ setSelectedClientToDelete, setShowDeleteClientModal }) => {
  const { state, dispatch } = useStatusNotification();
  const { userListObject } = useContext(UserListContext);

  const comparePerson = (a, b) => {
    if (a.familyName[0].toLowerCase() < b.familyName[0].toLowerCase()) {
      return -1;
    }
    if (a.familyName[0].toLowerCase() > b.familyName[0].toLowerCase()) {
      return 1;
    }
    return 0;
  };

  console.log(userListObject)
  const userListCopy = [...userListObject.userList];

  const sortedUserList = userListCopy.sort(comparePerson);

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
          {sortedUserList?.map((client, index) => {
            const labelId = `clientlist-checkbox-${index}`;
            return (
              <ClientListTableRow
                key={client.webId}
                labelId={labelId}
                client={client}
                state={state}
                dispatch={dispatch}
                setShowDeleteClientModal={setShowDeleteClientModal}
                setSelectedClientToDelete={setSelectedClientToDelete}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientListTable;
