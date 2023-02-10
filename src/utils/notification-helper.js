export const runNotification = (
  message,
  time,
  timeoutID,
  setStatusFunc,
  setTimeoutFunc
) => {
  // if local timeoutID exist, clear previous message and
  // run new status notification message
  if (timeoutID) {
    clearTimeout(timeoutID);
    setStatusFunc({ state: true, message });
  }

  // set timeout for potentially new notification
  const timeout = setTimeout(() => {
    setStatusFunc({
      state: false,
      message: "",
    });
  }, time * 1000);

  setTimeoutFunc(timeout);
  setStatusFunc({ state: true, message });
};
