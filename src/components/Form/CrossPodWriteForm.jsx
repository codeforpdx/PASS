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
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
  const { clearValue: clearUsername, ...username } = useField('text');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const [dateValue, setDateValue] = useState(new Date());

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
    clearUsername();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  const handleFormSubmit = makeHandleFormSubmission(
    INTERACTION_TYPES.CROSS,
    state,
    dispatch,
    session,
    clearInputFields
  );
  // Event handler for form/document submission to Pod
  const handleCrossPodUpload = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const podUsername = event.target.crossPodUpload.value || selectedUser;

    if (!podUsername) {
      runNotification('Search failed. Reason: Username not provided.', 5, state, dispatch);
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
            <Typography htmlFor="cross-upload-doc">Upload document to username:</Typography>
            <TextField
              id="cross-upload-doc"
              name="crossPodUpload"
              {...username}
              placeholder={selectedUser}
              label="Search username"
              required
            />
          </FormControl>
          <InputLabel htmlFor="cross-search-doctype">
            <em>Select Document Type</em>
          </InputLabel>
          <FormControl fullWidth>
            <DocumentSelection htmlId="cross-search-doctype" />
          </FormControl>
          <br />
          <FormControl>
            <Typography htmlFor="upload-doc-expiration">
              Expiration date (if applicable):
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DemoItem>
                  <DatePicker
                    label="Controlled picker"
                    value={dateValue}
                    onChange={(newValue) => setDateValue(newValue)}
                    id="upload-doc-expiration"
                    name="date"
                    type="date"
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
          <br />
          <FormControl fullWidth>
            <Typography htmlFor="upload-doc-desc">Enter description:</Typography>
            <TextField
              id="upload-doc-desc"
              name="description"
              {...description}
              multiline
              rows={4}
            />
          </FormControl>
          <br />
          <FormControl fullWidth>
            <Typography htmlFor="upload-doctype">File to upload:</Typography>
            <Button
              id="upload-doctype"
              type="file"
              name="uploadDoctype"
              accept=".pdf, .docx, .doc, .txt, .rtf"
              onChange={handleFileChange}
              variant="contained"
            >
              Choose File
              <input hidden accept=".pdf, .docx, .doc, .txt, .rtf" multiple type="file" />
            </Button>
          </FormControl>
          <FormControl fullWidth>
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Upload file
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default CrossPodWriteForm;
