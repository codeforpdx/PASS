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
import { deleteDocumentFile, deleteDocumentContainer, runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Component Imports
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

  return (
    <FormSection
      title="Delete Document"
      state={state}
      statusType="Deletion status"
      defaultMessage="To be deleted..."
    >
      <Box display="flex" justifyContent="center" sx={{ minWidth: 120 }}>
        <form onSubmit={handleDeleteDocument}>
          <InputLabel id="delete-doctype">
            <i>Select Document Type to Delete:</i>
          </InputLabel>
          <FormControl variant="standard" fullWidth>
            <DocumentSelection htmlId="search-doctype" />
            <br />
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Delete Document
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
};

export default DeleteDocumentForm;
