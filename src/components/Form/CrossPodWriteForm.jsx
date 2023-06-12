// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
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
  const [username, setUsername] = useState('');
  const [docType, setDocType] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
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

  const clearInputFields = (event) => {
    event.target.reset();
    clearDescription();
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

  const formRowStyle = {
    margin: '20px 0'
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Cross Pod Document Upload"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <form onSubmit={handleCrossPodUpload} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doc">Upload document to username: </label>
          <br />
          <br />
          <input
            id="cross-upload-doc"
            size="25"
            name="crossPodUpload"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={selectedUser.username}
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
          <br />
          <textarea id="upload-doc-desc" name="description" {...description} />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doctype">File to upload: </label>
          <input
            id="upload-doctype"
            type="file"
            name="uploadDoctype"
            accept=".pdf, .docx, .doc, .txt, .rtf, .gif"
            onChange={handleFileChange}
          />
          <button disabled={state.processing} type="submit">
            Upload file
          </button>
        </div>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default CrossPodWriteForm;
