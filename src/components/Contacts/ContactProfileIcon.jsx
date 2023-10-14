// React Imports
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Inrupt Imports
import { getWebIdDataset } from '@inrupt/solid-client';
// Material UI Imports
import ContactPageIcon from '@mui/icons-material/ContactPage';
import IconButton from '@mui/material/IconButton';
// Custom Hook Imports
import { useNotification } from '@hooks';
// Context Imports
import { DocumentListContext } from '@contexts';
// MUI Theme
import theme from '../../theme';

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
    >
      <IconButton onClick={() => handleSelectProfile(contact.value)}>
        <ContactPageIcon />
      </IconButton>
    </Link>
  );
};

export default ContactProfileIcon;
