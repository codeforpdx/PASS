// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { runNotification } from '../../utils';
// Custom Hook Imports
import { createDocument, replaceDocument } from '../../model-helpers';
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext } from '../../contexts';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * CrossPodWriteForm Component - Component that generates the form for cross pod
 * uploading for a specific document to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodWriteForm
 * @returns {React.ReactElement} The form
 */
const CrossPodWriteForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [docType, setDocType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const { selectedUser } = useContext(SelectUserContext);

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const clearInputFields = () => {
    setDocType('');
    setExpiryDate('');
    setDescription('');
    setFile(null);
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    const fileDesc = {
      name: file.name.split('.')[0],
      type: docType,
      date: expiryDate,
      description
    };
    runNotification(`Uploading "${file.name}" to Solid...`, 3, state, dispatch);
    const activePod = selectedUser.podUrl;

    try {
      await createDocument(file, fileDesc, session, `${activePod}PASS/`);
      runNotification(`File "${file.name}" uploaded to Solid.`, 5, state, dispatch);
    } catch (error) {
      const confirmationMessage =
        'A file of this name already exists on the pod. Would you like to replace it?';

      switch (error.message) {
        case 'File already exists':
          if (window.confirm(confirmationMessage)) {
            await replaceDocument(file, fileDesc, session, `${activePod}PASS/`);
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
      <form onSubmit={handleFormSubmission} autoComplete="off">
        <div style={formRowStyle}>
          <p>Upload document to {selectedUser.person}: </p>
          <br />
          <br />
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
            onChange={(e) => setFile(e.target.files[0])}
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
