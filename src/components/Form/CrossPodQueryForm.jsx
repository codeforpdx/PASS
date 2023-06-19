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
import { getDocuments, runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectedUserContext } from '../../contexts';
// Constants Imports
import { INTERACTION_TYPES } from '../../constants';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

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
  const { selectedUser } = useContext(SelectedUserContext);
  const [username, setUsername] = useState(selectedUser.username);
  const [docType, setDocType] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  // Clean up function for clearing input fields after submission
  const clearInputFields = () => {
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

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
      const documentUrl = await getDocuments(
        session,
        docType,
        INTERACTION_TYPES.CROSS,
        podUsername
      );

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification('Locating document...', 3, state, dispatch);

      // setTimeout is used to let getDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification('Document found! ', 3, state, dispatch);
        clearInputFields();
      }, 3000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification('Search failed. Reason: Document not found.', 5, state, dispatch);
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
          <Box display="flex" flexDirection="column" justifyContent="center">
            <FormControl>
              <TextField
                id="cross-search-doc"
                name="crossPodQuery"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder={selectedUser.username}
                label="Enter username"
                required
              />
            </FormControl>
            <DocumentSelection
              htmlForAndIdProp="cross-search-doctype"
              handleDocType={handleDocType}
              docType={docType}
            />
            <br />
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Search Pod
            </Button>
          </Box>
        </form>
      </Box>
    </FormSection>
  );
};

export default CrossPodQueryForm;
