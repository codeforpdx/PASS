import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { useField, useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import { runNotification, updateDocument, uploadDocument } from '../../utils';
import FormSection from './FormSection';
import { SelectUserContext } from '../../contexts';

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
  const { clearValue: clearUserUrl, ...userUrl } = useField('text');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);

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
    clearUserUrl();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod
  const handleCrossPodUpload = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    const expirationDate = event.target.date.value;
    const docDescription = event.target.description.value;
    let podUrl = event.target.crossPodUpload.value;

    if (!podUrl) {
      podUrl = selectedUser;
    }

    if (!podUrl) {
      runNotification('Search failed. Reason: Pod URL not provided.', 5, state, dispatch);
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
      await uploadDocument(session, 'cross', fileObject, podUrl);

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
        const fileExist = await updateDocument(session, 'cross', fileObject, podUrl);

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

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Cross Pod Document Upload"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <form onSubmit={handleCrossPodUpload} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doc">
            Search document from (i.e., username.opencommons.net):{' '}
          </label>
          <br />
          <br />
          <input
            id="cross-upload-doc"
            size="60"
            name="crossPodUpload"
            {...userUrl}
            placeholder={selectedUser}
          />
        </div>
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

export default CrossPodWriteForm;
