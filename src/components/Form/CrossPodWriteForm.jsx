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
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
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
  const [expireDate, setExpireDate] = useState(null);
  const [docType, setDocType] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleDocDescription = (event) => {
    setDocDescription(event.target.value);
  };

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

  // const clearInputFields = (event) => {
  //   event.target.reset();
  //   clearDescription();
  //   clearUsername();
  //   setExpireDate(null);
  //   setSelectedUser('');
  //   dispatch({ type: 'CLEAR_FILE' });
  //   dispatch({ type: 'CLEAR_PROCESSING' });
  // };
  const clearInputFields = () => {
    setUsername('');
    setDocType('');
    setExpireDate(null);
    setDocDescription('');
    setSelectedUser('');
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  const handleFormSubmit = makeHandleFormSubmission(
    // INTERACTION_TYPES.CROSS,
    // expireDate,
    // state,
    // dispatch,
    // session,
    // clearInputFields
    UPLOAD_TYPES.CROSS,
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
            <InputLabel htmlFor="upload-doc-expiration" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="upload-doc-expiration"
                name="date"
                format="MM/DD/YYYY"
                label="Expire date (if applicable)"
                value={expireDate}
                onChange={(newDate) => setExpireDate(newDate)}
              />
            </LocalizationProvider>
          </FormControl>
          <input
            id="cross-upload-doc"
            size="25"
            name="crossPodUpload"
            {...username}
            placeholder={selectedUser}
          />
        </div>
        <div style={formRowStyle}>
          <DocumentSelection
            htmlForAndIdProp="upload-doc"
            handleDocType={handleDocType}
            docType={docType}
          />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-expiration">Expiration date (if applicable): </label>
          <input id="upload-doc-expiration" name="date" type="date" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-desc">Enter description: </label>
          <br />
          <FormControl fullWidth>
            <Typography htmlFor="upload-doc-desc">Enter description:</Typography>
            <TextField
              id="upload-doc-desc"
              name="description"
              {...description}
              multiline
              rows={4}
              label="Enter Description"
              value={docDescription}
              onChange={handleDocDescription}
            />
          </FormControl>
          <br />
          <FormControl required>
            <InputLabel htmlFor="upload-doctype" />
            <Input
              id="upload-doctype"
              type="file"
              name="uploadDoctype"
              accept=".pdf, .docx, .doc, .txt, .rtf, .gif"
              onChange={handleFileChange}
            />
            <FormHelperText>
              File to upload:
              {state.file ? state.file.name : 'No file selected'}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Upload file
            </Button>
          </FormControl>
          <FormControl>
            <Button variant="contained" type="button" onClick={clearInputFields}>
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
