/**
 * Document Types is an array of strings that represent the different document
 * types for upload, fetch, or delete
 *
 * @memberof utils
 * @name docTypes
 * @type {Array<string>}
 * @property {string} BankStatement - Bank Statemet
 * @property {string} Passport - Passport
 * @property {string} DriversLicense - Drivers License
 * @property {string} Other - Anything Else
 */
const DOC_TYPES = {
  BankStatement: 'Bank Statement',
  Passport: 'Passport',
  DriversLicense: "Driver's License",
  Other: 'Other'
};

export default DOC_TYPES;
