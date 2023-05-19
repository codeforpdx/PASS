// React Imports
import React, { useState } from 'react';
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

  const [documentType, setdocumentType] = useState('');

  const handleChange = (event) => {
    setdocumentType(event.target.value);
  };

  // Event handler for deleting document
  const handleDeleteDocument = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = documentType;

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

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Delete Document"
      state={state}
      statusType="Deletion status"
      defaultMessage="To be deleted..."
    >
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth autoComplete="off">
          <InputLabel id="delete-doctype">
            <i>Select Document Type</i>
          </InputLabel>
          <DocumentSelection htmlId="delete-doctype" value={documentType} onChange={handleChange} />
        </FormControl>
        <br />
        <br />
        <Button
          variant="contained"
          fullWidth
          disabled={state.processing}
          type="submit"
          onClick={handleDeleteDocument}
        >
          Delete Document
        </Button>
      </Box>
    </FormSection>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default DeleteDocumentForm;
