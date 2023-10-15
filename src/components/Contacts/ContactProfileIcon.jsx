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
// MUI Theme
import theme from '../../theme';

/**
 * contactProfileIconProps is an object that stores the props for the
 * ContactProfileIcon component
 *
 * @typedef {object} contactProfileIconProps
 * @property {object} contact - Contain the object that stores contact metadata
 * @memberof typedefs
 */

/**
 * ContactProfileIcon Component - Component that generates the contact profile
 * icon for the Contacts List which is a special link to their profile page
 *
 * @memberof Contacts
 * @name ContactProfileIcon
 * @param {contactProfileIconProps} Props - Props for ContactProfileIcon
 * @returns {React.JSX.Element} The ContactProfileIcon Component
 */
const ContactProfileIcon = ({ contact }) => {
  const { setContact } = useContext(DocumentListContext);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // Event handler for profile page routing
  const handleSelectProfile = async (contactInfo) => {
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
      to={`/profile/${encodeURIComponent(contact.id)}`}
      state={{ contact: contact.value }}
      style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
      onClick={() => handleSelectProfile(contact.value)}
    >
      <ContactPageIcon />
    </Link>
  );
};

export default ContactProfileIcon;
