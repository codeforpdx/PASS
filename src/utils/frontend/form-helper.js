/**
 * Document Types is an array of strings that represent the different document
 * types for upload, fetch, or delete
 *
 * @memberof utils
 * @name docTypes
 * @type {Array<string>}
 * @property {string} Bank_Document - Bank Document
 * @property {string} Passport - Passport
 * @property {string} Drivers_License - Drivers License
 */

const docTypes = {
  BankStatement: 'Bank Statement',
  Passport: 'Passport',
  DriversLicense: "Driver's License"
};

export default docTypes;
