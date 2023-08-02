// React Imports
import React from 'react';
// Material UI Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// Component Imports
import ContactListTableRow from './ContactListTableRow';
import { StyledTableCell } from '../Table/TableStyles';

// ===== MAKE CHANGES HERE FOR TABLE HEADER / COLUMN TITLES =====
const columnTitlesArray = ['Contact', 'Pin', 'Delete'];

/**
 * @typedef {import("../../typedefs.js").clientListTableProps} clientListTableProps
 */

/**
 * ContactListTable Component - Component that generates table of clients from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {clientListTableProps} Props - Props for ContactListTableRow
 * @returns {React.JSX.Element} The ContactListTableRow Component
 */
const ContactListTable = ({ contacts, deleteContact }) => (
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
        {contacts?.map((contact) => (
          <ContactListTableRow
            key={contact.webId}
            contact={contact}
            deleteContact={deleteContact}
          />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ContactListTable;
