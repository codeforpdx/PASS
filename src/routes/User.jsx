// React Imputs
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// Custom Hook Imports
import { useStatusNotification } from '../hooks';
// Utility Imports
import { getDocTTLs, runNotification } from '../utils';
// Context Imports
import { SignedInUserContext } from '../contexts';
// Component Imports
import { ShowDocumentsModal } from '../components/DocumentModals';
import FormSection from '../components/Form/FormSection';

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

  const { state, dispatch } = useStatusNotification();

  // EXPERIMENTAL - Event handler for displaying Documents from PASS
  const { session } = useSession();
  const [fileSrc, setFileSrc] = useState([]);
  const [showDocument, setShowDocument] = useState(false);
  const { podUrl } = useContext(SignedInUserContext);

  const handleShowFile = async () => {
    dispatch({ type: 'SET_PROCESSING' });

    runNotification(`Fetching documents from Pod...`, 5, state, dispatch);
    const allPermittedData = await getDocTTLs(session, podUrl);

    setFileSrc(allPermittedData);
    setShowDocument(!showDocument);

    setTimeout(() => {
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 5000);
  };

  return (
    <FormSection
      title="Preview Documents"
      state={state}
      statusType="Preview Status"
      defaultMessage="To be previewed..."
    >
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        <Button
          disabled={state.processing}
          variant="contained"
          type="button"
          onClick={handleShowFile}
        >
          Show Documents
        </Button>
        <ShowDocumentsModal
          showModal={showDocument}
          setShowModal={setShowDocument}
          fileSrc={fileSrc}
        />
      </Container>
    </FormSection>
  );
};

export default User;
