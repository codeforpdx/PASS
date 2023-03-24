import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { useField, useStatusNotification } from '../../hooks';
import { uploadDocument, runNotification } from '../../utils';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { updateDocument } from '../../utils/session-core';

/**
 * UploadDocumentForm Component - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name UploadDocumentForm
 */

const UploadDocumentForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();

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

  // Event handler for form/document submission to Pod
  const handleFormSubmission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    const expirationDate = event.target.date.value;
    const docDescription = event.target.description.value;

    if (!state.file) {
      runNotification('Submission failed. Reason: missing file', 2, state, dispatch);
      return;
    }

    const fileObject = {
      type: docType,
      date: expirationDate || 'Not available',
      description: docDescription || 'No description provided',
      file: state.file
    };

    try {
      await uploadDocument(session, fileObject);

      runNotification(`Uploading "${fileObject.file.name}" to Solid...`, 3, state, dispatch);

      // setTimeout is used to let uploadDocument finish its upload to user's Pod
      setTimeout(() => {
        runNotification(`File "${fileObject.file.name}" uploaded to Solid.`, 7, state, dispatch);
      }, 3000);
    } catch {
      try {
        await updateDocument(session, fileObject);

        runNotification('Updating file on Solid...', 3, state, dispatch);

        setTimeout(() => {
          runNotification(`File "${fileObject.file.name}" updated on Solid.`, 7, state, dispatch);
        }, 3000);
      } catch {
        runNotification('Update failed. Reason: Bad request', 3, state, dispatch);
      }
    }

    setTimeout(() => {
      dispatch({ type: 'CLEAR_FILE' });
      event.target.uploadDoctype.value = '';
      clearDescription();
    }, 7000);
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Upload Document"
      state={state}
      statusType="Writing status"
      defaultMessage="To be uploaded..."
    >
      <form onSubmit={handleFormSubmission} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="upload-doc">Select document type to upload: </label>
          <DocumentSelection htmlId="upload-doc" />
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
            accept=".pdf, .docx, .doc, .txt, .rtf"
            onChange={handleFileChange}
          />
          <button disabled={state.processing} type="submit">
            Upload file
          </button>
        </div>
      </form>
    </FormSection>
  );
};

export default UploadDocumentForm;
