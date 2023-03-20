import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { deleteDocumentFile, deleteDocumentContainer, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * DeleteDocumentForm Component - Component that generates the form for
 * deleting a specific document type from a user's Solid Pod via Solid Session
 * @memberof Forms
 * @component
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

      // Solid requires all files to be removed from container before it can be removed
      // setTimeout lets deleteDocumentFile finish removing the files
      setTimeout(() => {
        deleteDocumentContainer(session, documentUrl);
        runNotification('Removing file container from Pod...', 7, state, dispatch);
      }, 3000);
    } catch (_error) {
      runNotification('Deletion failed. Reason: Data not found', 3, state, dispatch);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection state={state} statusType="Deletion status" defaultMessage="To be deleted...">
      <strong>Delete Document</strong>
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
  );
};

export default DeleteDocumentForm;
