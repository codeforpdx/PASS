// React Imports
import React, { useContext, useState } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// Custom Component Imports
import { useField, useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import { runNotification, updateDocument, uploadDocument } from '../../utils';
import FormSection from './FormSection';
import { SelectUserContext } from '../../contexts';
import { UPLOAD_TYPES } from '../../constants';

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
  const [documentType, setdocumentType] = useState('');

  const handleChange = (event) => {
    setdocumentType(event.target.value);
  };

  // Initalized state for file upload
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
    clearUsername();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod
  /* eslint-disable no-param-reassign */
  const handleCrossPodUpload = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    const expirationDate = event.target.date.value;
    const docDescription = event.target.description.value;
    let podUsername = event.target.crossPodUpload.value;

    if (!podUsername) {
      podUsername = selectedUser;
    }

    if (!podUsername) {
      runNotification('Search failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

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
      await uploadDocument(session, UPLOAD_TYPES.CROSS, fileObject, podUsername);

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
        const fileExist = await updateDocument(
          session,
          UPLOAD_TYPES.CROSS,
          fileObject,
          podUsername
        );

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
      title="Cross Pod Document Upload"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <Box sx={{ minWidth: 120 }}>
        <form onSubmit={handleCrossPodUpload} autoComplete="off">
          <div>
            <label htmlFor="cross-upload-doc">Search document from username: </label>
            <br />
            <br />
            <input
              id="cross-upload-doc"
              size="60"
              name="crossPodUpload"
              {...username}
              placeholder={selectedUser}
            />
          </div>
          <div>
            <FormControl fullWidth autoComplete="off">
              <InputLabel id="upload-doc">
                <i>Select Document Type</i>
              </InputLabel>
              <DocumentSelection htmlId="upload-doc" value={documentType} onChange={handleChange} />
            </FormControl>
          </div>
          <div>
            <label htmlFor="upload-doc-expiration">Expiration date (if applicable): </label>
            <input id="upload-doc-expiration" name="date" type="date" />
          </div>
          <div>
            <label htmlFor="upload-doc-desc">Enter description: </label>
            <br />
            <br />
            <textarea id="upload-doc-desc" name="description" {...description} />
          </div>
          <div>
            <label htmlFor="upload-doctype">File to upload: </label>
            <input
              id="upload-doctype"
              type="file"
              name="uploadDoctype"
              accept=".pdf, .docx, .doc, .txt, .rtf"
              onChange={handleFileChange}
            />
          </div>
          <Button
            variant="contained"
            fullWidth
            disabled={state.processing}
            type="submit"
            onClick={handleCrossPodUpload}
          >
            Upload file
          </Button>
        </form>
      </Box>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default CrossPodWriteForm;
