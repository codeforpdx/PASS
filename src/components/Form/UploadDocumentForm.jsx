// React Imports
import React, { useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormHelperText from '@mui/material/FormHelperText';
// Utility Imports
import { makeHandleFormSubmission, runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Constants Imports
import { INTERACTION_TYPES } from '../../constants';
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
  const [expireDate, setExpireDate] = useState(null);
  const [docDescription, setDocDescription] = useState('');
  const [docType, setDocType] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  // Initialized state for file upload
  const handleFileChange = (event) => {
    if (event.target.files.length === 1) {
      dispatch({ type: 'SET_FILE', payload: event.target.files[0] });
    } else {
      dispatch({ type: 'CLEAR_FILE' });
    }
  };

  const clearInputFields = () => {
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_VERIFY_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
    setDocDescription('');
    setDocType('');
    setExpireDate(null);
  };

  // Event handler for form/document submission to Pod
  const handleFormSubmit = makeHandleFormSubmission(
    INTERACTION_TYPES.SELF,
    expireDate,
    state,
    dispatch,
    session,
    clearInputFields
  );

  const handleDocumentUpload = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });

    if (!docType) {
      runNotification('Search failed. Reason: No document type selected.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    handleFormSubmit(event);
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Upload Document"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleDocumentUpload} autoComplete="off">
          <label htmlFor="verify-checkbox">
            Verify File on upload:
            <input
              id="verify-checkbox"
              type="checkbox"
              value={state.verifyFile}
              onClick={() => dispatch({ type: 'TOGGLE_VERIFY_FILE' })}
            />
          </label>
          <DocumentSelection
            htmlForAndIdProp="upload-doc"
            handleDocType={handleDocType}
            docType={docType}
          />
          <br />
          <FormControl>
            {/* TODO: Determine whether InputLabel below is necessary or redundant */}
            <InputLabel htmlFor="upload-doc-expiration" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="upload-doc-expiration"
                name="date"
                format="MM/DD/YYYY"
                label="Expire date (if applicable)"
                value={expireDate}
                onChange={(newExpireDate) => setExpireDate(newExpireDate)}
                type="date"
                slotProps={{
                  textField: {
                    helperText: 'MM/DD/YYYY'
                  }
                }}
              />
            </LocalizationProvider>
          </FormControl>
          <br />
          <br />
          <br />
          <FormControl fullWidth>
            {/* TODO: Determine whether Typography below is necessary or redundant */}
            {/* <Typography htmlFor="upload-doc-desc">Enter description:</Typography> */}
            <TextField
              id="upload-doc-desc"
              name="description"
              multiline
              rows={4}
              label="Enter description"
              value={docDescription}
              onChange={(newDocDescription) => setDocDescription(newDocDescription.target.value)}
              placeholder="Add a description here"
            />
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <Button
              variant="contained"
              component="label"
              color="primary"
              id="upload-doctype"
              name="uploadDoctype"
              onChange={handleFileChange}
              required
            >
              Choose file
              <input type="file" hidden accept=".pdf, .docx, .doc, .txt, .rtf" multiple />
            </Button>
            <FormHelperText
              sx={{
                display: 'inline-block',
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden !important',
                textOverflow: 'ellipsis'
              }}
            >
              File to upload: {state.file ? state.file.name : 'No file selected'}
            </FormHelperText>
          </FormControl>
          <br />
          <FormControl fullWidth>
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Upload file
            </Button>
          </FormControl>
          <br />
          <br />

          {/* TODO: Determine whether we want a pop-up warning for the user to confirm this action */}
          <FormControl fullWidth>
            <Button variant="contained" type="button" color="secondary" onClick={clearInputFields}>
              Clear Form
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default UploadDocumentForm;
