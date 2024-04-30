const saveToClipboard = (text, message, addNotification) => {
  navigator.clipboard.writeText(text);
  addNotification('success', message);
};

export default saveToClipboard;
