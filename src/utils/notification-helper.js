export const runNotification = (
  message,
  time, // in seconds
  timeoutID,
  setStatusFunc,
  setTimeoutFunc
) => {
  // if local timeoutID exist, clear previous message and run new status notification message
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  setStatusFunc(message);
  // set timeout for potentially new notification
  const timeout = setTimeout(() => {
    setStatusFunc("");
  }, time * 1000);
  setTimeoutFunc(timeout);
};
