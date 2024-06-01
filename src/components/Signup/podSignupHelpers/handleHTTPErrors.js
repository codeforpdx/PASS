/**
 * @param {object} response - HTTP response object
 * @param {string} response.message - message body
 * @param {number} response.statusCode - HTTP Status Code
 * @throws {Error} - message containing error values
 * @returns {void} - either throws or nothing
 */
export default function handleIncomingHTTPErrors({ message, statusCode }) {
  // left as a switch for now, in case different handling will be done based on error code in the future

  switch (statusCode) {
    case 400:
      throw new Error(message);
    case 401:
      throw new Error(message);
    case 500:
      throw new Error(message);
    default:
      if (statusCode <= 400) throw new Error(message);
      else break;
  }
}
