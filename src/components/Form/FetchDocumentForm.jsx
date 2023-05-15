// React Imports
import React, { useState } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Custom Component Imports
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

  const [documentType, setdocumentType] = useState('');

  const handleChange = (event) => {
    setdocumentType(event.target.value);
  };

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

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Search Document"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <form onSubmit={handleGetDocumentSubmission} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="search-doctype">Select document type to search: </label>
          <DocumentSelection htmlId="search-doctype" />

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="select-document-type-label">Document Type</InputLabel>
              <Select
                labelId="select-document-type-label"
                id="select-document-type"
                value={documentType}
                label="Document Type"
                onChange={handleChange}
              >
                <MenuItem value="bankStatement">Bank Statement</MenuItem>
                <MenuItem value="passport">Passport</MenuItem>
                <MenuItem value="driversLicense">Driver&apos;s License</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button variant="contained" fullWidth disabled={state.processing} type="submit">
            Get Document
          </Button>
        </div>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default FetchDocumentForm;
