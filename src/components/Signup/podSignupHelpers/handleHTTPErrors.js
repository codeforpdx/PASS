/**
 * @param {object} response - HTTP response object
 * @param {string} response.message - message body
 * @param {number} response.statusCode - HTTP Status Code
 * @throws {Error} - message containing error values
 * @returns {void} - either throws or nothing
 */
export default function handleIncomingHTTPErrors({ message, statusCode }) {
  // extensible with new error codes and messages
  if (statusCode !== 400) return;

  switch (message) {
    case 'There already is a login for this e-mail address.':
      throw new Error(message);
    default:
      break;
  }
}
