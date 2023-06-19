// React Imports
import React, { useState, useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import { TextField, Button, Box } from '@mui/material';
// Utility Imports
import { deleteDocument } from '../../model-helpers';
import { runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { SelectedUserContext } from '../../contexts';

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
  const { selectedUser } = useContext(SelectedUserContext);
  const [docType, setDocType] = useState('');
  const [docName, setDocName] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  // Event handler for deleting document
  const handleDeleteDocument = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docUrl = `${selectedUser.podUrl}PASS/Documents/${docType}/${docName}/`;

    try {
      runNotification('Deleting Document...', 3, state, dispatch);
      await deleteDocument(session, docUrl);
      runNotification('Document successfully deleted...', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
    } catch (error) {
      runNotification(`Deletion failed. Reason: ${error.message}`, 10, state, dispatch);
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
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleDeleteDocument}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <DocumentSelection
              htmlForAndIdProp="delete-doctype"
              handleDocType={handleDocType}
              docType={docType}
            />
            <br />
            <TextField
              type="text"
              label="Document Name"
              variant="filled"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
            <br />
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Delete Document
            </Button>
          </Box>
        </form>
      </Box>
    </FormSection>
  );
};

export default DeleteDocumentForm;
