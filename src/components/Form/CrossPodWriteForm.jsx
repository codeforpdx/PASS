// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormHelperText from '@mui/material/FormHelperText';
// Utility Imports
import { runNotification, makeHandleFormSubmission } from '../../utils';
// Custom Hook Imports
import { useField, useStatusNotification } from '../../hooks';
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
  const [expireDate, setExpireDate] = useState(null);
  const [username, setUsername] = useState();
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

  // Custom useField hook for handling form inputs
  const { clearValue: clearDescription, _type, ...description } = useField('textarea');

  const clearInputFields = (event) => {
    event.target.reset();
    clearDescription();
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
    // setDocType('');
    // setExpireDate(null);
    // setSelectedUser('');
  };

  const handleFormSubmit = makeHandleFormSubmission(
    INTERACTION_TYPES.CROSS,
    expireDate,
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

  /* eslint-disable jsx-a11y/label-has-associated-control */
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
            {/* TODO: Determine whether Typography below is necessary or redundant */}
            {/* Either way, also determine whether to update all other forms to that */}
            <Typography htmlFor="cross-upload-doc">Upload document to username:</Typography>
            <TextField
              id="cross-upload-doc"
              name="crossPodUpload"
              {...username}
              // placeholder={selectedUser}
              label="Search username"
              required
              value={username}
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
            {/* TODO: Determine whether InputLabel below is necessary or redundant */}
            <InputLabel htmlFor="upload-doc-expiration" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="upload-doc-expiration"
                name="date"
                format="MM/DD/YYYY"
                label="Expire date (if applicable)"
                // value={expireDate}
                // onChange={(newDate) => setExpireDate(newDate)}
                type="date"
              />
            </LocalizationProvider>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            {/* TODO: Determine whether Typography below is necessary or redundant */}
            <Typography htmlFor="upload-doc-desc">Enter description:</Typography>
            <TextField
              id="upload-doc-desc"
              name="description"
              {...description}
              multiline
              rows={4}
              label="Enter Description"
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
            <FormHelperText>
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

export default CrossPodWriteForm;
