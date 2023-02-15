/**
 * Function to run status messages provided a message given a string for the message, time, timeoutID of previous message (if exist), and useReducer dispatch function
 * @memberof utils
 * @function runNotification
 * @param {string} message - File status message for upload, fetch, or delete file
 * @param {number} time - Duration of message in seconds
 * @param {string|null} timeoutID - TimeoutID of previous dispatch call
 * @param {React.DispatchWithoutAction} dispatch - useReducer dispatch function
 * @returns {void} Void - Status message is displayed via dispatch call
 */

export const runNotification = (
  message,
  time, // in seconds
  timeoutID,
  dispatch
) => {
  // if local timeoutID exist, clear previous message and run new status notification message
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  dispatch({ type: "SET_MESSAGE", payload: message });
  // set timeout for potentially new notification
  const timeout = setTimeout(() => {
    dispatch({ type: "SET_MESSAGE", payload: "" });
  }, time * 1000);
  dispatch({ type: "SET_TIMEOUTID", payload: timeout });
};
