// React Imports
import React, { useState, useContext } from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
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
import { DocumentSelection, FormSection } from '../Form';
import { DocumentListContext, UserDocumentListContext } from '../../contexts';

/**
 * UploadDocumentModal Component - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name UploadDocumentModal
 */

const UploadDocumentModal = ({ user, showModal, setShowModal }) => {
  const { state, dispatch } = useStatusNotification();
  const [expireDate, setExpireDate] = useState(null);
  const [docDescription, setDocDescription] = useState('');
  const [docType, setDocType] = useState('');
  const [verifyFile, setVerifyFile] = useState(false);
  const [file, setFile] = useState(null);
  const [inputKey, setInputKey] = useState(false);
  const { addDocument, replaceDocument } =
    user === 'personal' ? useContext(UserDocumentListContext) : useContext(DocumentListContext);

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
    setShowModal(false);
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
    runNotification(`Uploading file to Solid...`, 3, state, dispatch);

    try {
      await addDocument(fileDesc, file);
      runNotification(`File uploaded to Solid.`, 5, state, dispatch);
    } catch (error) {
      const confirmationMessage =
        'A file of this name and type already exists on the pod. Would you like to replace it?';

      switch (error.message) {
        case 'File already exists':
          if (window.confirm(confirmationMessage)) {
            await replaceDocument(fileDesc, file);
            runNotification(`File updated on Solid.`, 5, state, dispatch);
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
    <Dialog open={showModal} aria-labelledby="upload-document-dialog" onClose={clearInputFields}>
      <FormSection
        title="Upload Document"
        state={state}
        statusType="Upload status"
        defaultMessage="To be uploaded..."
        file={file}
      >
        <form onSubmit={handleDocUpload} autoComplete="off">
          <FormControlLabel
            control={<Switch />}
            label="Verify file on upload"
            id="verify-checkbox"
            value={verifyFile}
            checked={verifyFile}
            onChange={() => setVerifyFile(!verifyFile)}
            sx={{ mb: 1 }}
          />
          <FormControl fullWidth>
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
              </LocalizationProvider>
            </FormControl>
            <br />
            <TextField
              name="description"
              multiline
              rows={4}
              label="Enter Description"
              value={docDescription}
              onChange={(newDocDescription) => setDocDescription(newDocDescription.target.value)}
              placeholder="Add a description here"
            />
            <br />
            {/* File to upload: {file ? file.name : 'No file selected'} */}
            <Button
              variant={file ? 'outlined' : 'contained'}
              component="label"
              color="primary"
              id="upload-doctype"
              name="uploadDoctype"
              onChange={(e) => setFile(e.target.files[0])}
              required
              startIcon={<SearchIcon />}
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
            <DialogActions>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={clearInputFields}
                fullWidth
                helpertext="Please enter your name"
              >
                CANCEL
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
            </DialogActions>
          </FormControl>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default UploadDocumentModal;
