// React Imports
import React, { useState } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// Custom Component Imports
import { useField, useStatusNotification } from '../../hooks';
import { uploadDocument, updateDocument, runNotification } from '../../utils';
import { UPLOAD_TYPES } from '../../constants';
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

  const clearInputFields = () => {
    clearDescription();
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod
  /* eslint-disable no-param-reassign */
  const handleFormSubmission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = documentType;
    const expirationDate = event.target.date.value;
    const docDescription = event.target.description.value;

    if (!state.file) {
      runNotification('Submission failed. Reason: missing file', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    const fileObject = {
      type: docType,
      date: expirationDate || 'Not available',
      description: docDescription || 'No description provided',
      file: state.file
    };

    const fileName = fileObject.file.name;

    try {
      await uploadDocument(session, UPLOAD_TYPES.SELF, fileObject);

      runNotification(`Uploading "${fileName}" to Solid...`, 3, state, dispatch);

      // setTimeout is used to let uploadDocument finish its upload to user's Pod
      setTimeout(() => {
        runNotification(`File "${fileName}" uploaded to Solid.`, 5, state, dispatch);
        setTimeout(() => {
          event.target.uploadDoctype.value = '';
          event.target.date.value = '';
          clearInputFields();
        }, 3000);
      }, 3000);
    } catch {
      try {
        const fileExist = await updateDocument(session, UPLOAD_TYPES.SELF, fileObject);

        runNotification('Updating contents in Solid Pod...', 3, state, dispatch);

        if (fileExist) {
          setTimeout(() => {
            runNotification(`File "${fileName}" updated on Solid.`, 5, state, dispatch);
            setTimeout(() => {
              event.target.uploadDoctype.value = '';
              event.target.date.value = '';
              clearInputFields();
            }, 3000);
          }, 3000);
        } else {
          setTimeout(() => {
            runNotification(`File "${fileName}" uploaded on Solid.`, 5, state, dispatch);
            setTimeout(() => {
              event.target.uploadDoctype.value = '';
              event.target.date.value = '';
              clearInputFields();
            }, 3000);
          }, 3000);
        }
      } catch (error) {
        runNotification(`Operation failed. Reason: ${error.message}`, 5, state, dispatch);
        setTimeout(() => {
          event.target.uploadDoctype.value = '';
          event.target.date.value = '';
          clearInputFields();
        }, 3000);
      }
    }
  };
  /* eslint-enable no-param-reassign */

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
          <InputLabel id="upload-doctype">
            <i>Select Document Type</i>
          </InputLabel>
          <DocumentSelection htmlId="upload-doctype" value={documentType} onChange={handleChange} />
          <div>
            <label htmlFor="upload-doc-expiration">Expiration date (if applicable): </label>
            <input id="upload-doc-expiration" name="date" type="date" />
          </div>
          <div>
            <label htmlFor="upload-doc-desc">Enter description: </label>
            <TextField
              id="upload-doc-desc"
              name="description"
              {...description}
              multiline
              rows={4}
              fullWidth
            />
          </div>
          <label htmlFor="upload-doctype">File to upload: </label>
          <Button
            id="upload-doctype"
            type="file"
            name="uploadDoctype"
            onClick={handleFileChange}
            variant="contained"
            fullWidth
            // component="label"
            // labelId="upload-doctype"
            // onClick={handleChange}
          >
            Choose File
            <input hidden accept=".pdf, .docx, .doc, .txt, .rtf" multiple type="file" />
          </Button>
          <br />
        </FormControl>
        <Button
          variant="contained"
          fullWidth
          disabled={state.processing}
          type="submit"
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
