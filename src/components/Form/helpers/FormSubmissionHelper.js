import { uploadDocument, updateDocument, runNotification } from '../../../utils';

const makeHandleFormSubmission =
  (uploadType, state, dispatch, session, clearInputFields) =>
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

    const fileObject = {
      type: event.target.document.value,
      date: event.target.date.value,
      description: event.target.description.value,
      file: state.file
    };

    const fileName = fileObject.file.name;

    try {
      runNotification(`Uploading "${fileName}" to Solid...`, 3, state, dispatch);

      await uploadDocument(session, uploadType, fileObject, crossPodUsername);

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
