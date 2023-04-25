import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { deleteDocumentFile, deleteDocumentContainer, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * DeleteDocumentForm Component - Component that generates the form for deleting
 * a specific document type from a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name DeleteDocumentForm
 */

const DeleteDocumentForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();

  // Event handler for deleting document
  const handleDeleteDocument = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;

    try {
      const documentUrl = await deleteDocumentFile(session, docType);

      runNotification('File being deleted from Pod...', 3, state, dispatch);

      // Solid requires all files to be removed from container before it can be
      // removed setTimeout lets deleteDocumentFile finish removing the files
      setTimeout(() => {
        deleteDocumentContainer(session, documentUrl);
        runNotification('Removing file container from Pod...', 5, state, dispatch);
        setTimeout(() => {
          dispatch({ type: 'CLEAR_PROCESSING' });
        }, 3000);
      }, 3000);
    } catch (_error) {
      runNotification('Deletion failed. Reason: Data not found.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <Container component="main" maxWidth="">
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '5px',
          width: '95vw'
        }}
      >
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <FormSection
            title="Delete Document"
            state={state}
            statusType="Deletion status"
            defaultMessage="To be deleted..."
          >
            <form onSubmit={handleDeleteDocument} autoComplete="off">
              <div style={formRowStyle}>
                <label htmlFor="delete-doctype">Select document type to delete: </label>
                <DocumentSelection htmlId="delete-doctype" />{' '}
                <button disabled={state.processing} type="submit">
                  Delete Document
                </button>
              </div>
            </form>
          </FormSection>
        </Paper>
      </Box>
    </Container>
  );
};

export default DeleteDocumentForm;
