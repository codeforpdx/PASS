import { BrowserPDF417Reader } from '@zxing/browser';

/**
 * Reads a scanned Image file, and returns the raw image data
 *
 * @memberof utils
 * @function readImageFile
 * @param {object} file - image to be read
 * @returns {Promise} Promise - returns a Promise with base64 image
 */
const readImageFile = async (file) => {
  const returnedImage = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target.result;
      image.onload = () => resolve(image);
      image.onerror = (e) => {
        reject(e);
      };
    };
    reader.readAsDataURL(file);
  });
  return returnedImage;
};

/**
 * Decodes the barcode using @zxing library,
 * returning the data as text
 *
 * @memberof utils
 * @function decodeBarcode
 * @param {object} image - raw returned image data from readImageFile
 * @returns {Promise<string>} result.text - decoded text data barcode image
 */

const decodeBarcode = async (image) => {
  try {
    const codeReader = new BrowserPDF417Reader();
    const result = await codeReader.decodeFromImageElement(image);
    return result.text;
  } catch (error) {
    return new Error('Error :', error);
  }
};

/**
 * Formats the returned data into JSON
 *
 * @memberof utils
 * @function csvToJson
 * @param {string} csvData - textual data returned from decodeBarcode
 * @returns {object} obj - returns barcode data as JSON object
 */

const csvToJson = (csvData) => {
  const rows = csvData.split('\n');

  // TODO: Clean up this logic later...
  const keys = [];
  const values = [];
  rows.forEach((row) => {
    keys.push(row.substring(0, 3));
    values.push(row.substring(3, row.length));
  });

  // TODO: Use more accurate naming convention here (i.e. obj is too generic)
  const obj = {};
  rows.forEach((_row, i) => {
    if (i === 0) {
      obj.DCA = `${values[i]}`;
    } else {
      obj[`${keys[i]}`] = `${values[i]}`;
    }
  });
  return obj;
};

/**
 * Calls previous helper functions to
 * scan, decode, and parse scanned image data
 *
 * @memberof utils
 * @function getDriversLicenseData
 * @param {object} file - image to be read
 * @returns {object} returnedData - JSON object containing scanned barcode data
 */
const getDriversLicenseData = async (file) => {
  const image = await readImageFile(file);
  const decoded = await decodeBarcode(image);
  let returnedData = '';
  if (decoded) {
    const jsonData = csvToJson(decoded);
    returnedData = jsonData;
  } else {
    returnedData = new Error('Unable to decode file');
  }

  return returnedData;
};

export default getDriversLicenseData;
