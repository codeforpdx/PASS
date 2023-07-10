// React Imports
import React, { useState, useContext } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormHelperText from '@mui/material/FormHelperText';
// Utility Imports
import { runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { DocumentListContext } from '../../contexts';

/**
 * UploadDocumentForm Component - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name UploadDocumentForm
 */

const UploadDocumentForm = () => {
  const { state, dispatch } = useStatusNotification();
  const [expireDate, setExpireDate] = useState(null);
  const [docDescription, setDocDescription] = useState('');
  const [docType, setDocType] = useState('');
  const [verifyFile, setVerifyFile] = useState(false);
  const [file, setFile] = useState(null);
  const [inputKey, setInputKey] = useState(false);
  const { addDocument, replaceDocument } = useContext(DocumentListContext);

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const clearInputFields = () => {
    setVerifyFile(false);
    setDocType('');
    setFile('');
    setInputKey(!inputKey); // Clears file by forcing re-render
    setDocDescription('');
    setDocType('');
    setExpireDate(null);
  };

  // Event handler for form/document submission to Pod
  const handleDocUpload = async (e) => {
    e.preventDefault();

    const fileDesc = {
      name: file.name,
      type: docType,
      date: expireDate,
      description: docDescription
    };
    dispatch({ type: 'SET_PROCESSING' });
    runNotification(`Uploading "${file.name}" to Solid...`, 3, state, dispatch);

    try {
      await addDocument(fileDesc, file);
      runNotification(`File "${file.name}" uploaded to Solid.`, 5, state, dispatch);
    } catch (error) {
      const confirmationMessage =
        'A file of this name and type already exists on the pod. Would you like to replace it?';

      switch (error.message) {
        case 'File already exists':
          if (window.confirm(confirmationMessage)) {
            await replaceDocument(fileDesc, file);
            runNotification(`File "${file.name}" updated on Solid.`, 5, state, dispatch);
          }
          break;
        default:
          runNotification(`File failed to upload. Reason: ${error.message}`, 5, state, dispatch);
      }
    } finally {
      clearInputFields();
      dispatch({ type: 'CLEAR_PROCESSING' });
    }
  };

  return (
    <FormSection
      title="Upload Document"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleDocUpload} autoComplete="off">
          <FormControlLabel
            control={<Checkbox />}
            label="Verify file on upload"
            id="verify-checkbox"
            value={verifyFile}
            checked={verifyFile}
            onChange={() => setVerifyFile(!verifyFile)}
          />
          <DocumentSelection
            htmlForAndIdProp="upload-doc"
            handleDocType={handleDocType}
            docType={docType}
          />
          <br />
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="date"
                format="MM/DD/YYYY"
                label="Expiration Date"
                value={expireDate}
                onChange={(newExpireDate) => setExpireDate(newExpireDate)}
                type="date"
              />
              <FormHelperText>MM/DD/YYYY</FormHelperText>
            </LocalizationProvider>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <TextField
              name="description"
              multiline
              rows={4}
              label="Enter Description"
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
              onChange={(e) => setFile(e.target.files[0])}
              required
            >
              Choose file
              <input
                type="file"
                hidden
                accept=".pdf, .docx, .doc, .txt, .rtf, .gif, .png, .jpeg, .jpg, .webp"
              />
            </Button>
            <FormHelperText
              sx={{
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              File to upload: {file ? file.name : 'No file selected'}
            </FormHelperText>
          </FormControl>
          <br />
          <FormControl fullWidth>
            <Button
              variant="contained"
              disabled={state.processing || !file}
              type="submit"
              color="primary"
            >
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
};

export default UploadDocumentForm;
