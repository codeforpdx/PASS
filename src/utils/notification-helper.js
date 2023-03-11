/**
 * Function that runs status messages provided a message, the duration (time in seconds), the timeoutID of previous message (if exist), and the useReducer dispatch function
 * @memberof utils
 * @function runNotification
 * @param {string} message - File status message for upload, fetch, or delete file
 * @param {number} time - Duration of message in seconds
 * @param {useStatusNotificationObject} state - useStatusNotificationObject
 * @param {React.DispatchWithoutAction} dispatch - useStatusNotification dispatch function
 * @returns {void} Void - Status message is displayed via dispatch call
 */

const runNotification = (
  message,
  time, // in seconds
  state,
  dispatch
) => {
  // if local timeoutID exist, clear previous message and run new status notification message
  if (state.timeoutID) {
    clearTimeout(state.timeoutID);
  }

  dispatch({ type: 'SET_MESSAGE', payload: message });

  // set timeout for potentially new notification
  const timeout = setTimeout(() => {
    dispatch({ type: 'CLEAR_MESSAGE' });
    dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
  }, time * 1000);

  dispatch({ type: 'SET_TIMEOUT_ID', payload: timeout });
  dispatch({ type: 'CLEAR_PROCESSING' });
};

export default runNotification;
