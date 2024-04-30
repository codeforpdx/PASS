/**
 * Function that saves the provided text to the clipboard and sends the user a notification.
 *
 * @memberof utils
 * @function saveToClipboard
 * @param {string} text - Text to be saved to the clipboard
 * @param {string} message - Message to be displayed in the notification
 * @param {Function} addNotification - Function to display the notification
 * @returns {void} - This function does not have a return
 */
const saveToClipboard = (text, message, addNotification) => {
  navigator.clipboard.writeText(text);
  addNotification('success', message);
};

export default saveToClipboard;
