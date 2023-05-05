import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { getDocuments, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
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
        runNotification('Document found! Document located at: ', 5, state, dispatch);
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

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <Container component="" maxWidth="">
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <FormSection
            title="Search Document"
            state={state}
            statusType="Search status"
            defaultMessage="To be searched..."
          >
            <form onSubmit={handleGetDocumentSubmission} autoComplete="off">
              <div style={formRowStyle}>
                <label htmlFor="search-doctype">Select document type to search: </label>
                <DocumentSelection htmlId="search-doctype" />{' '}
                <button disabled={state.processing} type="submit">
                  Get Document
                </button>
              </div>
            </form>
          </FormSection>{' '}
        </Paper>
      </Box>
    </Container>
  );
};

export default FetchDocumentForm;
