/**
 * Document Types is an array of strings that represent the different document
 * types for upload, fetch, or delete
 *
 * @memberof utils
 * @name docTypes
 * @type {Array<string>}
 * @property {string} bankStatement - Bank Statement
 * @property {string} passport - Passport
 * @property {string} driversLicense - Drivers License
 * @property {string} other - Anything Else
 */
const DOC_TYPES = {
  bankStatement: 'Bank Statement',
  passport: 'Passport',
  driversLicense: "Driver's License",
  other: 'Other'
};

export default DOC_TYPES;
