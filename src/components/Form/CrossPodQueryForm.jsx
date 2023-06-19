// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// Utility Imports
import { getDocuments, getPodUrl, runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext } from '../../contexts';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import ShowDocumentsModal from '../Modals/ShowDocumentsModal';

/**
 * CrossPodQueryForm Component - Component that generates the form for cross pod
 * search for a specific document from another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodQueryForm
 */

const CrossPodQueryForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { selectedUser } = useContext(SelectUserContext);
  const [username, setUsername] = useState('');
  const [docType, setDocType] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  // Clean up function for clearing input fields after submission
  const clearInputFields = () => {
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  const [fileSrc, setFileSrc] = useState(null);
  const [showDocument, setShowDocument] = useState(false);

  // Event handler for Cross Pod Querying/Searching
  const handleCrossPodQuery = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    let podUsername = event.target.crossPodQuery.value;

    if (!podUsername) {
      podUsername = selectedUser.username;
    }

    if (!podUsername) {
      runNotification('Search failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    if (!docType) {
      runNotification('Search failed. Reason: No document type selected.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    try {
      const documentTTLData = await getDocuments(session, docType, getPodUrl(podUsername));

      runNotification('Locating document...', 3, state, dispatch);

      setFileSrc(documentTTLData);
      setShowDocument(!showDocument);

      setTimeout(() => {
        runNotification('Document found! ', 3, state, dispatch);
        clearInputFields();
      }, 3000);
    } catch (error) {
      runNotification(`Operation failed. Reason: ${error.message}`, 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  return (
    <FormSection
      title="Cross Pod Search"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleCrossPodQuery} autoComplete="off">
          <FormControl>
            <TextField
              id="cross-search-doc"
              name="crossPodQuery"
              value={selectedUser.person ? selectedUser.username : username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder={selectedUser.username}
              label="Search Username"
              required
            />
          </FormControl>
          <DocumentSelection
            htmlForAndIdProp="cross-search-doctype"
            handleDocType={handleDocType}
            docType={docType}
          />
          <br />
          <Button
            variant="contained"
            disabled={state.processing}
            type="submit"
            color="primary"
            fullWidth
          >
            Search Pod
          </Button>
          {fileSrc && (
            <ShowDocumentsModal
              showModal={showDocument}
              setShowModal={setShowDocument}
              fileSrc={fileSrc}
            />
          )}
        </form>
      </Box>
    </FormSection>
  );
};

export default CrossPodQueryForm;
