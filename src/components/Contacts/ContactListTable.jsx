// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import { NewMessageModal } from '../Modals';
import ContactListTableDesktop from './ContactListTableDesktop';
import ContactListTableMobile from './ContactListTableMobile';

/**
 * @typedef {import("../../typedefs.js").userListObject} userListObject
 */

/**
 * ContactListTable - Component that generates the list of contacts
 * from data within ContactList
 *
 * @memberof Contacts
 * @name ContactListTable
 * @param {object} Props - Props for ContactListTable
 * @param {userListObject[]} Props.contacts - This list of contacts to display
 * @param {Function} Props.deleteContact - Method to delete contact
 * @returns {React.JSX.Element} The ContactListTable Component
 */
const ContactListTable = ({ contacts, deleteContact }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageToField, setMessageToField] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSendMessage = (contactId) => {
    setShowMessageModal(!showMessageModal);
    setMessageToField(isSmallScreen ? contactId.podUrl : contactId.value.podUrl);
  };

  return (
    <Box
      sx={{
        margin: '20px 0',
        width: '95vw',
        height: '500px'
      }}
    >
      {isSmallScreen ? (
        <ContactListTableMobile
          contacts={contacts}
          deleteContact={deleteContact}
          handleSendMessage={handleSendMessage}
        />
      ) : (
        <ContactListTableDesktop
          contacts={contacts}
          deleteContact={deleteContact}
          handleSendMessage={handleSendMessage}
          // handleProfileClick={handleProfileClick}
        />
      )}
      <NewMessageModal
        showModal={showMessageModal}
        setShowModal={setShowMessageModal}
        toField={messageToField}
      />
    </Box>
  );
};

export default ContactListTable;
