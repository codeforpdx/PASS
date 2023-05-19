// React Imports
import React, { useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// Utility Imports
import { makeHandleFormSubmission } from '../../utils';
// Custom Hook Imports
import { useField, useStatusNotification } from '../../hooks';
// Constants Imports
import { UPLOAD_TYPES } from '../../constants';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * UploadDocumentForm Component - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name UploadDocumentForm
 */

const UploadDocumentForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [documentType, setDocumentType] = useState('');

  const handleChange = (event) => {
    setDocumentType(event.target.value);
  };

  // Initialized state for file upload
  const handleFileChange = (event) => {
    if (event.target.files.length === 1) {
      dispatch({ type: 'SET_FILE', payload: event.target.files[0] });
    } else {
      dispatch({ type: 'CLEAR_FILE' });
    }
  };

  // Custom useField hook for handling form inputs
  const { clearValue: clearDescription, _type, ...description } = useField('textarea');

  const clearInputFields = (event) => {
    event.target.reset();
    clearDescription();
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_VERIFY_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod
  const handleFormSubmission = makeHandleFormSubmission(
    UPLOAD_TYPES.SELF,
    state,
    dispatch,
    session,
    clearInputFields
  );

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Upload Document"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth autoComplete="off">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Verify File on upload:"
              labelPlacement="start"
              id="verify-checkbox"
              type="checkbox"
              value={state.verifyFile}
              onClick={() => dispatch({ type: 'TOGGLE_VERIFY_FILE' })}
            />
          </FormGroup>
          <FormControl fullWidth autoComplete="off">
            <InputLabel id="upload-doctype">
              <i>Select Document Type</i>
            </InputLabel>
            <DocumentSelection
              htmlId="upload-doctype"
              value={documentType}
              onChange={handleChange}
            />
          </FormControl>
          <br />
          <label htmlFor="upload-doc-expiration">Expiration date (if applicable): </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker id="upload-doc-expiration" name="date" type="date" />
          </LocalizationProvider>
          <br />
          <label htmlFor="upload-doc-desc">Enter description: </label>
          <TextField
            id="upload-doc-desc"
            name="description"
            {...description}
            multiline
            rows={4}
            fullWidth
          />
        </FormControl>
        <br />
        <br />
        <label htmlFor="upload-doctype">File to upload: </label>
        <Button
          variant="contained"
          fullWidth
          type="file"
          id="upload-doctype"
          name="uploadDoctype"
          accept=".pdf, .docx, .doc, .txt, .rtf, .gif"
          onChange={handleFileChange}
        >
          Choose File
          <input hidden accept=".pdf, .docx, .doc, .txt, .rtf" multiple type="file" />
        </Button>
        <br />
        <br />
        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={state.processing}
          onClick={handleFormSubmission}
        >
          Upload file
        </Button>
      </Box>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default UploadDocumentForm;
