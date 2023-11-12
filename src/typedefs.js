/**
 * @namespace typedefs
 */

/**
 * An input object for functions related to file uploads to Solid's Pod
 *
 * @exports fileObjectType
 * @typedef {object} fileObjectType
 * @property {string} type - Type of document
 * @property {string} date - Date of upload
 * @property {string} description - Description of document
 * @property {object} file - An object which contain information about the file
 * being uploaded as well the document itself
 * @memberof typedefs
 */

/**
 * An object that stores the user's name and their Pod URL
 *
 * @exports userListObject
 * @typedef {object} userListObject
 * @property {string} person - Full name of user
 * @property {string} givenName - First/given name of user
 * @property {string} familyName - Last/family name of user
 * @property {URL} podUrl - A user's Solid pod URL
 * @property {URL} webId - A user's webId
 * @memberof typedefs
 */

/**
 * An object that stores the user's name and their Pod URL
 *
 * @exports messageListObject
 * @typedef {object} messageListObject
 * @property {string} message - Message content
 * @property {string} messageId - Message ID
 * @property {URL} messageUrl - URL of message being sent
 * @property {string} title - Message title
 * @property {Date} uploadDate - Time of message sent
 * @property {string} sender - Name of sender
 * @property {URL} senderWebId - WebId of the sender
 * @property {string} recipient - Name of recipient
 * @property {boolean} readStatus - Boolean of read status with true meaning have been
 * read before
 * @memberof typedefs
 */

exports.unused = {};
