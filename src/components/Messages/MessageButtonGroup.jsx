// React Imports
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import useMediaQuery from '@mui/material/useMediaQuery';

const routesArray = [
  { label: 'Inbox', path: 'inbox' },
  { label: 'Outbox', path: 'outbox' }
];

/**
 *  Renders the Message Button Group component for new message, inbox, and outbox
 *
 * @param {object} Props - The Props for MessageButtonGroup Component
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowModal -
 * The set function for showModal
 * @param {string} Props.boxType - The state for inbox or outbox
 * @param {React.Dispatch<React.SetStateAction<string>>} Props.setBoxType - The
 * set function for boxType
 * @returns {React.JSX.Element} - The MessageButtonGroup Component
 */
const MessageButtonGroup = ({ setShowModal, boxType, setBoxType }) => {
  const isReallySmallScreen = useMediaQuery('(max-width: 480px)');
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setBoxType(path);
    navigate(`/messages/${path}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '20px 30px 10px',
        flexDirection: isReallySmallScreen ? 'column' : 'row',
        alignItems: isReallySmallScreen ? 'center' : ''
      }}
    >
      <Button
        variant="contained"
        onClick={() => setShowModal(true)}
        startIcon={<CreateIcon />}
        color="secondary"
      >
        New Message
      </Button>
      <Tabs value={boxType} sx={{ padding: '0 15px' }}>
        {routesArray.map(({ label, path }) => (
          <Tab
            key={`${label}Tab`}
            value={path}
            label={label}
            onClick={() => handleNavigate(path)}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default MessageButtonGroup;
