import runNotification from './notification-helper';
import { uploadDocument, updateDocument } from '../network/session-core';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * Makes a default handleFormSubmission function that can be used
 * by form elements in PASS
 *
 * @memberof utils
 * @function makeHandleFormSubmission
 * @param {string} uploadType - Type of upload (cross, self, etc.) to perform
 * @param {string} expireDate - document expiration date
 * @param {string} docDescription - document description
 * @param {object} state - current state
 * @param {object} dispatch - dispatch for actions
 * @param {Session} session - current Solid session
 * @param {Function} clearInputFields - function to call to clear form
 * @returns {Function} A function that components can call to submit forms to PASS
 */
const makeHandleFormSubmission =
  (uploadType, expireDate, docDescription, state, dispatch, session, clearInputFields) =>
  async (event, crossPodUsername = '') => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });

    if (!state.file) {
      runNotification('Submission failed. Reason: missing file', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    const docType = event.target.document.value;
    const formattedDate = expireDate ? expireDate.format('MM/DD/YYYY') : 'No date provided';

    const fileObject = {
      type: docType,
      date: formattedDate,
      docDescription: event.target.docDescription.value || 'No description provided',
      file: state.file
    };

    try {
      runNotification(`Uploading to Pod...`, 3, state, dispatch);

      await uploadDocument(session, uploadType, fileObject, state.verifyFile, crossPodUsername);

      runNotification(`File uploaded on Pod.`, 5, state, dispatch);
      clearInputFields(event);
    } catch (e) {
      try {
        runNotification('Updating on Pod...', 3, state, dispatch);

        await updateDocument(session, uploadType, fileObject, crossPodUsername);

        runNotification(`File updated on Pod.`, 5, state, dispatch);
        clearInputFields(event);
      } catch (error) {
        runNotification(`Operation failed. Reason: ${error.message}`, 5, state, dispatch);
        setTimeout(() => {
          clearInputFields(event);
        }, 3000);
      }
    }
  };

export default makeHandleFormSubmission;
