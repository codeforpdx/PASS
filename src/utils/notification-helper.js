/**
 * @typedef {Object} statusNotificationObject
 * @property {String|null} documentUrl - Url link to document container
 * @property {String} message - Status message for file upload, query, or deletion
 * @property {String|null} timeoutID - Timeout ID for status message
 * @property {Object|null} file - Object that includes file in question
 * @property {Boolean} processing - Boolean on whether application is uploading,
 * fetching, querying data from Solid
 */

/**
 * Function that runs status messages provided a message, the duration (time in seconds),
 * the timeoutID of previous message (if exist), and the useReducer dispatch function
 * @memberof utils
 * @function runNotification
 * @param {String} message - File status message for upload, fetch, or delete file
 * @param {Number} time - Duration of message in seconds
 * @param {statusNotificationObject} state - useStatusNotificationObject
 * @param {React.DispatchWithoutAction} dispatch - useStatusNotification dispatch function
 * @returns {Void} Void - Status message is displayed via dispatch call
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
    dispatch({ type: 'CLEAR_PROCESSING' });
  }, time * 1000);

  dispatch({ type: 'SET_TIMEOUT_ID', payload: timeout });
};

export default runNotification;
