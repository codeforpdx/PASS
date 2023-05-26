/*
 * Formats dates returned from barcode scanner
 * into consistent format (i.e. 2023-12-31)
 *
 * @memberof utils
 * @function formattedDate
 * @param {string} dateStr - unformatted date string
 * @ returns {string} newDate.toISOstring.substring(0, 10) - formatted date string
 */

const formattedDate = (dateStr) => {
  const dateStrWithSpaces = dateStr.replace(/(\d{2})(\d{2})(\d{4})/, '$1 $2 $3');
  const newDate = new Date(dateStrWithSpaces);
  return newDate.toISOString().substring(0, 10);
};

export default formattedDate;
