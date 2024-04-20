// React Imports
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Inrupt Imports
import { getWebIdDataset } from '@inrupt/solid-client';
// Material UI Imports
import ContactPageIcon from '@mui/icons-material/ContactPage';
// Custom Hook Imports
import { useNotification } from '@hooks';
// Context Imports
import { DocumentListContext } from '@contexts';

/**
 * contactAccountIconProps is an object that stores the props for the
 * ContactAccountIcon component
 *
 * @typedef {object} contactAccountIconProps
 * @property {object} contact - Contain the object that stores contact metadata
 * @memberof typedefs
 */

/**
 * ContactAccountIcon Component - Component that generates the contact account
 * icon for the Contacts List which is a special link to their account page
 *
 * @memberof Contacts
 * @name ContactAccountIcon
 * @param {contactAccountIconProps} Props - Props for ContactAccountIcon
 * @returns {React.JSX.Element} The ContactAccountIcon Component
 */
const ContactAccountIcon = ({ contact }) => {
  const { setContact } = useContext(DocumentListContext);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // Event handler for account page routing
  const handleSelectAccount = async (contactInfo) => {
    try {
      await getWebIdDataset(contactInfo.webId);
      setContact(contactInfo);
    } catch {
      setContact(null);
      navigate('/contacts');
      addNotification('error', 'WebId does not exist');
    }
  };

  return (
    <Link
      to={`/contacts/${encodeURIComponent(contact.id)}`}
      state={{ contact: contact.value }}
      onClick={() => handleSelectAccount(contact.value)}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <ContactPageIcon sx={{ color: 'gray' }} titleAccess="contact account link" />
    </Link>
  );
};

export default ContactAccountIcon;
