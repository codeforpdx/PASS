// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// Context Imports
import { UserListContext } from '@contexts';
// Component Imports
import ClientListTableRow from './ClientListTableRow';
import { StyledTableCell } from '../Table/TableStyles';

// ===== MAKE CHANGES HERE FOR TABLE HEADER / COLUMN TITLES =====
const columnTitlesArray = ['Client', 'Pin', 'Delete'];

/**
 * @typedef {import("../../typedefs.js").clientListTableProps} clientListTableProps
 */

/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 * @param {clientListTableProps} Props - Props for ClientListTable
 * @returns {React.JSX.Element} The ClientListTable Component
 */
const ClientListTable = ({ setSelectedClientToDelete, setShowDeleteClientModal }) => {
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

  const userListCopy = [...userListObject.userList];

  const sortedUserList = userListCopy.sort(comparePerson);

  return (
    <TableContainer component={Paper} sx={{ margin: '1rem 0', maxWidth: '500px' }}>
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
          {sortedUserList?.map((client) => (
            <ClientListTableRow
              key={client.webId}
              client={client}
              setShowDeleteClientModal={setShowDeleteClientModal}
              setSelectedClientToDelete={setSelectedClientToDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientListTable;
