// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// Utility Imports
import { getDocuments, runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * FetchDocumentForm Component - Component that generates the form for searching
 * a specific document type from a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name FetchDocumentForm
 */

const FetchDocumentForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();

  // Event handler for searching/fetching document
  const handleGetDocumentSubmission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;

    try {
      const documentUrl = await getDocuments(session, docType, 'self-fetch');

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification('Locating document...', 3, state, dispatch);

      // setTimeout is used to let getDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification('Document found! ', 5, state, dispatch);
        setTimeout(() => {
          dispatch({ type: 'CLEAR_PROCESSING' });
        }, 3000);
      }, 3000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification('Search failed. Reason: Document not found.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
    }
  };

  return (
    <FormSection
      title="Search Document"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <Box display="flex" justifyContent="center" sx={{ minWidth: 120 }}>
        <form onSubmit={handleGetDocumentSubmission}>
          <InputLabel id="search-doctype">
            <em>Select Document Type</em>
          </InputLabel>
          <FormControl fullWidth>
            <DocumentSelection htmlId="search-doctype" />
            <br />
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Get Document
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
};

export default FetchDocumentForm;
