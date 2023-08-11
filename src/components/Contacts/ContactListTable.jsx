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
 * contactListTableProps is an object that stores the props for the
 * ContactListTable component
 *
 * @typedef {object} contactListTableProps
 * @property {Array} contacts - this list of contacts to display 
 * @property {Function} deleteContact - method to delete contact 
 * @memberof typedefs
 */

/**
 * ContactListTable Component - Component that generates table of contacts from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {contactListTableProps} Props - Props for ContactListTableRow
 * @returns {React.JSX.Element} The ContactListTableRow Component
 */
const ContactListTable = ({ contacts, deleteContact }) => {
  const comparePerson = (a, b) => {
    if (a.familyName[0].toLowerCase() < b.familyName[0].toLowerCase()) {
      return -1;
    }
    if (a.familyName[0].toLowerCase() > b.familyName[0].toLowerCase()) {
      return 1;
    }
    return 0;
  };
  const contactsCopy = [...contacts];

  const sortedContacts = contactsCopy.sort(comparePerson);

  return (
    <TableContainer component={Paper} sx={{ margin: '1rem 0', maxWidth: '500px' }}>
      <Table aria-label="contact list table">
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
          {sortedContacts?.map((contact) => (
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
};

export default ContactListTable;
