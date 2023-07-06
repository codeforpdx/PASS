// React Imports
import React, { useState, useContext } from 'react';
// Material UI Imports
import BackspaceOutlined from '@mui/icons-material/BackspaceOutlined';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Utility Imports
import { runNotification } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Component Imports
import DocumentSelection from '../Form/DocumentSelection';
import FormSection from '../Form/FormSection';
import { DocumentListContext } from '../../contexts';

/**
 * UploadDocumentModal Component - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name UploadDocumentModal
 */

const UploadDocumentModal = ({ showModal, setShowModal }) => {
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

    if (!docType) {
      runNotification('Upload failed. Reason: No document type selected.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    const fileDesc = {
      name: file.name,
      type: docType,
      date: expireDate,
      description: docDescription
    };
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
    }
  };

  return (
    <Dialog
      open={showModal}
      aria-labelledby="upload-document-dialog"
      onClose={() => setShowModal(false)}
    >
      <FormSection
        title="Upload Document"
        state={state}
        statusType="Upload status"
        defaultMessage="To be uploaded..."
      >
        <form onSubmit={handleDocUpload} autoComplete="off">
          <FormControl>
            <FormControlLabel
              control={<Switch />}
              label="Verify file on upload"
              id="verify-checkbox"
              value={verifyFile}
              checked={verifyFile}
              onChange={() => setVerifyFile(!verifyFile)}
            />
            <Grid
              container
              spacing={{
                xs: 1
              }}
            >
              <Grid item xs={12} sm={6}>
                <DocumentSelection
                  htmlForAndIdProp="upload-doc"
                  handleDocType={handleDocType}
                  docType={docType}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="date"
                    format="MM/DD/YYYY"
                    label="Expiration Date"
                    value={expireDate}
                    onChange={(newExpireDate) => setExpireDate(newExpireDate)}
                    type="date"
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <TextField
              name="description"
              multiline
              rows={4}
              label="Enter Description"
              value={docDescription}
              onChange={(newDocDescription) => setDocDescription(newDocDescription.target.value)}
              placeholder="Add a description here"
              margin="normal"
            />
            {/* TODO: Determine whether we want a pop-up warning for the user to confirm this action */}
            <ButtonGroup aria-label="primary button group" fullWidth>
              <Button
                variant="outlined"
                component="label"
                color="primary"
                id="upload-doctype"
                name="uploadDoctype"
                onChange={(e) => setFile(e.target.files[0])}
                required
                startIcon={<SearchIcon />}
              >
                Choose file
                <input type="file" hidden accept=".pdf, .docx, .doc, .txt, .rtf, .gif, .png" />
              </Button>
              <Button
                variant="contained"
                disabled={state.processing || !file}
                type="submit"
                color="primary"
                startIcon={<FileUploadIcon />}
                fullWidth
              >
                Upload
              </Button>
            </ButtonGroup>
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
            <ButtonGroup aria-label="secondary button group" fullWidth>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={() => setShowModal(false)}
                fullWidth
                helperText="Please enter your name"
              >
                CANCEL
              </Button>
              <Button
                variant="contained"
                type="button"
                color="secondary"
                onClick={clearInputFields}
                startIcon={<BackspaceOutlined />}
              >
                Clear Form
              </Button>
            </ButtonGroup>
          </FormControl>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default UploadDocumentModal;
