// React Imports
import React, { useState, useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
import { SignedInUserContext } from '../../contexts/SignedInUserContext';
import { createDocument, replaceDocument, signDocument } from '../../model-helpers';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { runNotification } from '../../utils';
import { SelectUserContext } from '../../contexts';

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
  const [docType, setDocType] = useState('');
  const [verifyFile, setVerifyFile] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState('');
  const { podUrl } = useContext(SignedInUserContext);
  const { selectedUser } = useContext(SelectUserContext);

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
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_VERIFY_FILE' });
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
      name: file.name.split('.')[0],
      type: docType,
      date: expiryDate,
      description
    };
    runNotification(`Uploading "${file.name}" to Solid...`, 3, state, dispatch);
    const activePod = selectedUser.podUrl || podUrl;

    try {
      const doc = await createDocument(file, fileDesc, session, `${activePod}PASS/`);
      if (verifyFile)
        await signDocument(doc, session, `${activePod}PASS/${docType}/${file.name.split('.')[0]}/`);
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
            onChange={(e) => setVerifyFile(e.target.value)}
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
