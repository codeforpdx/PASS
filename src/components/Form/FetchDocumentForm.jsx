// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// Utility Imports
import { getDocuments, runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { SignedInUserContext } from '../../contexts';
import ShowDocumentsModal from '../Modals/ShowDocumentsModal';

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
  const [docType, setDocType] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const [fileSrc, setFileSrc] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const { podUrl } = useContext(SignedInUserContext);

  // Event handler for searching/fetching document
  const handleGetDocumentSubmission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });

    if (!docType) {
      runNotification('Search failed. Reason: No document type selected.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    try {
      const documentTTLData = await getDocuments(session, docType, podUrl);
      runNotification('Locating document...', 3, state, dispatch);

      setFileSrc(documentTTLData);
      setShowDocument(!showDocument);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 5000);
    } catch (error) {
      runNotification(`Operation failed. Reason: ${error.message}`, 5, state, dispatch);
      dispatch({ type: 'CLEAR_PROCESSING' });
    }
  };

  return (
    <FormSection
      title="Search Document"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleGetDocumentSubmission}>
          <DocumentSelection
            htmlForAndIdProp="search-doctype"
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
            Get Document
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

export default FetchDocumentForm;
