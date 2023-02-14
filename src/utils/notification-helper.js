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
