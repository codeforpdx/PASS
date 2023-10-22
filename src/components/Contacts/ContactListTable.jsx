// React Imports
import React from 'react';
// Material UI Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// MUI Theme
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
// Component Imports
import ContactListTableRow from './ContactListTableRow';

// ===== MAKE CHANGES HERE FOR TABLE HEADER / COLUMN TITLES =====
const columnTitlesArray = ['Contact', 'Pin', 'Delete'];

/**
 * @typedef {import("../../typedefs.js").userListObject} userListObject
 */

/**
 * ContactListTable Component - Component that generates table of contacts from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {object} Props - Props for ContactListTable
 * @param {userListObject[]} Props.contacts - this list of contacts to display
 * @param {Function} Props.deleteContact - method to delete contact
 * @returns {React.JSX.Element} The ContactListTable Component
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
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} sx={{ margin: '1rem 0', maxWidth: '500px' }}>
        <Table aria-label="contact list table">
          <TableHead>
            <TableRow>
              {columnTitlesArray.map((columnTitle) => (
                <TableCell key={columnTitle} align="center">
                  {columnTitle}
                </TableCell>
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
    </ThemeProvider>
  );
};

export default ContactListTable;
