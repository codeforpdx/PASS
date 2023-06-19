// React Imports
import React, { useState, useContext } from 'react';
// Inrupt Library Imports
import { useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { runNotification } from '../../utils';
import { DocumentListContext } from '../../contexts';

/**
 * UploadDocumentForm Component - Component that generates the form for uploading
 * a specific document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name UploadDocumentForm
 */

const UploadDocumentForm = () => {
  const { state, dispatch } = useStatusNotification();
  const [docType, setDocType] = useState('');
  const [verifyFile, setVerifyFile] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [inputKey, setInputKey] = useState(false);
  const { addDocument, replaceDocument } = useContext(DocumentListContext);

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  // Custom useField hook for handling form inputs

  const clearInputFields = () => {
    setVerifyFile(false);
    setDocType('');
    setExpiryDate('');
    setDescription('');
    setFile(null);
    setInputKey(!inputKey); // clears file by forcing re-render
    dispatch({ type: 'CLEAR_PROCESSING' });
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
      date: expiryDate,
      description
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

  const formRowStyle = {
    margin: '20px 0'
  };
  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Upload Document"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <form onSubmit={handleDocUpload} autoComplete="off">
        <label htmlFor="verify-checkbox">
          Verify File on upload:
          <input
            id="verify-checkbox"
            type="checkbox"
            value={verifyFile}
            onChange={() => setVerifyFile(!verifyFile)}
          />
        </label>
        <div style={formRowStyle}>
          <DocumentSelection
            htmlForAndIdProp="upload-doc"
            handleDocType={handleDocType}
            docType={docType}
          />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-expiration">Expiration date (if applicable): </label>
          <input
            id="upload-doc-expiration"
            name="date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-desc">Enter description: </label>
          <br />
          <br />
          <textarea
            id="upload-doc-desc"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doctype">File to upload: </label>
          <input
            id="upload-doctype"
            type="file"
            key={inputKey}
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

export default UploadDocumentForm;
