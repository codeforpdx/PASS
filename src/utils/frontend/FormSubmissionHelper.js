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
 * @param {Dayjs} expireDate - Expiration Date
 * @param {object} state - current state
 * @param {object} dispatch - dispatch for actions
 * @param {Session} session - current Solid session
 * @param {Function} clearInputFields - function to call to clear form
 * @returns {Function} A function that components can call to submit forms to PASS
 */
const makeHandleFormSubmission =
  (uploadType, expireDate, state, dispatch, session, clearInputFields) =>
  async (event, crossPodUsername = '') => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    // const expirationDate = event.target.date.value;
    const docDescription = event.target.description.value;

    if (!state.file) {
      runNotification('Submission failed. Reason: missing file', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    const formattedDate = expireDate ? expireDate.format('MM/DD/YYYY') : 'No Date Provided';

    const fileObject = {
      type: docType,
      date: formattedDate || 'Not available',
      description: docDescription || 'No description provided',
      file: state.file
    };

    const fileName = fileObject.file.name;

    try {
      runNotification(`Uploading "${fileName}" to Solid...`, 3, state, dispatch);

      await uploadDocument(session, uploadType, fileObject, state.verifyFile, crossPodUsername);

      runNotification(`File "${fileName}" updated on Solid.`, 5, state, dispatch);
      clearInputFields(event);
    } catch (e) {
      try {
        runNotification('Updating contents in Solid Pod...', 3, state, dispatch);

        await updateDocument(session, uploadType, fileObject, crossPodUsername);

        runNotification(`File "${fileName}" updated on Solid.`, 5, state, dispatch);
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
