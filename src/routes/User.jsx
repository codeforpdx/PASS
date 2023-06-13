// React Imputs
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// Utility Imports
import { showDocuments } from '../utils';
// Context Imports
import { SignedInUserContext } from '../contexts';
// Component Imports
import { ShowDocumentsModal } from '../components/Clients';

/**
 * User - Page that displays the User's stored Documents
 *
 * @memberof Pages
 * @name User
 * @returns {React.ReactElement} The user page
 */

const User = () => {
  const location = useLocation();
  localStorage.setItem('restorePath', location.pathname);

  // EXPERIMENTAL - Event handler for displaying Documents from PASS
  const { session } = useSession();
  const [fileSrc, setFileSrc] = useState([]);
  const [showDocument, setShowDocument] = useState(false);
  const { podUrl } = useContext(SignedInUserContext);

  const handleShowFile = async () => {
    let allUrls;

    try {
      allUrls = await showDocuments(session, podUrl);

      setFileSrc(allUrls);
      setShowDocument(!showDocument);
    } catch {
      throw new Error('Unauthorized or no documents found');
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <Button variant="contained" type="button" onClick={handleShowFile} sx={{ marginTop: '3rem' }}>
        Show Documents
      </Button>
      <ShowDocumentsModal
        showModal={showDocument}
        setShowModal={setShowDocument}
        fileSrc={fileSrc}
      />
    </Container>
  );
};

export default User;
