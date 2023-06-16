// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormHelperText from '@mui/material/FormHelperText';
// Utility Imports
import { runNotification, makeHandleFormSubmission } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext } from '../../contexts';
// Constants Imports
import { INTERACTION_TYPES } from '../../constants';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * CrossPodWriteForm Component - Component that generates the form for cross pod
 * uploading for a specific document to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodWriteForm
 */

const CrossPodWriteForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { selectedUser } = useContext(SelectUserContext);
  const [username, setUsername] = useState('');
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
    dispatch({ type: 'CLEAR_PROCESSING' });
    setDocDescription('');
    setDocType('');
    setExpireDate(null);
    setUsername('');
  };

  const handleFormSubmit = makeHandleFormSubmission(
    INTERACTION_TYPES.CROSS,
    expireDate,
    docDescription,
    state,
    dispatch,
    session,
    clearInputFields
  );

  // Event handler for form/document submission to Pod
  const handleCrossPodUpload = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const podUsername = event.target.crossPodUpload.value || selectedUser.username;

    if (!podUsername) {
      runNotification('Search failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    if (!docType) {
      runNotification('Search failed. Reason: No document type selected.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    handleFormSubmit(event, podUsername);
  };

  return (
    <FormSection
      title="Cross Pod Document Upload"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleCrossPodUpload} autoComplete="off">
          <FormControl fullWidth>
            <Typography>Upload document to username:</Typography>
            <TextField
              name="crossPodUpload"
              label="Search Username"
              required
              value={selectedUser.person ? selectedUser.person : username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={selectedUser.username}
            />
          </FormControl>
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
              onChange={handleFileChange}
              required
            >
              Choose file
              <input type="file" hidden accept=".pdf, .docx, .doc, .txt, .rtf" multiple />
            </Button>
            <FormHelperText
              sx={{
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
};

export default CrossPodWriteForm;
