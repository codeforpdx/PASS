// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { makeHandleFormSubmission } from '../../utils';
// Custom Hook Imports
import { useField, useStatusNotification } from '../../hooks';
// Constants Imports
import { UPLOAD_TYPES } from '../../constants';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

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

  const clearInputFields = (event) => {
    event.target.reset();
    clearDescription();
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_VERIFY_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod
  const handleFormSubmission = makeHandleFormSubmission(
    UPLOAD_TYPES.SELF,
    state,
    dispatch,
    session,
    clearInputFields
  );

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
      <form onSubmit={handleFormSubmission} autoComplete="off">
        <label htmlFor="verify-checkbox">
          Verify File on upload:
          <input
            id="verify-checkbox"
            type="checkbox"
            value={state.verifyFile}
            onClick={() => dispatch({ type: 'TOGGLE_VERIFY_FILE' })}
          />
        </label>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc">Select Document Type</label>
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

export default UploadDocumentForm;
