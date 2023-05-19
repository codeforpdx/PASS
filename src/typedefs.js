const React = require('react');

/**
 * @namespace typedefs
 */

/**
 * A React props object for the StatusMessage component
 *
 * @exports statusMessageProps
 * @typedef statusMessageProps
 * @type {object}
 * @property {string} notification - File status message
 * @property {string} [locationUrl] - URL location of file, if exist
 * @memberof typedefs
 */

/**
 * A React props object for the StatusNotification component
 *
 * @exports statusNotificationProps
 * @typedef statusNotificationProps
 * @type {object}
 * @property {string} notification - File status message
 * @property {string} statusType - Type of file status (i.e. file upload, file
 * fetch, file delete)
 * @property {string} defaultMessage - Default message when status is not
 * triggered
 * @property {URL} [locationUrl] - URL location of file, if exist
 * @memberof typedefs
 */

/**
 * An object containing the type, value, onChange function, and clearValue
 * function for the custom useField hook
 *
 * @exports useFieldObject
 * @typedef useFieldObject
 * @type {object}
 * @property {string} type - Type attribute of HTML input element
 * @property {string} value - The value of input element
 * @property {Function} onChange - Event handler for changes in input element
 * @property {Function} clearValue - Event handler that clears value set for
 * input element
 * @memberof typedefs
 */

/**
 * An object containing the status notification state used for both the
 * StatusNotification and StatusMessage components
 *
 * @exports statusNotificationObject
 * @typedef statusNotificationObject
 * @type {object}
 * @property {URL|null} documentUrl - Url link to document container
 * @property {string} message - Status message for file upload, query, or deletion
 * @property {string|null} timeoutID - Timeout ID for status message
 * @property {object|null} file - Object that includes file in question
 * @property {boolean} processing - Boolean on whether application is uploading,
 * fetching, querying data from Solid
 * @property {boolean} verifyFile - Boolean on whether to verify file upon file
 * upload
 * @memberof typedefs
 */

/**
 * An object containing the status notification state and useReducer dispatch
 * function from the custom useStatusNotification hook
 *
 * @exports useStatusNotificationObject
 * @typedef useStatusNotificationObject
 * @type {object}
 * @property {statusNotificationObject} statusNotificationObject - An object
 * consisting of the state for status notifications (see {@link statusNotificationObject})
 * @property {React.DispatchWithoutAction} dispatch - React's useReducer dispatch
 * function
 * @memberof typedefs
 */

/**
 * An input object for functions related to file uploads to Solid's Pod
 *
 * @exports fileObjectType
 * @typedef fileObjectType
 * @type {object}
 * @property {string} type - Type of document
 * @property {string} date - Date of upload
 * @property {string} description - Description of document
 * @property {object} file - An object which contain infomation about the file
 * being uploaded as well the document itself
 * @memberof typedefs
 */

/**
 * A React props object for FormSection component
 *
 * @exports formSectionProps
 * @typedef formSectionProps
 * @type {object}
 * @property {string} title - Title of form section
 * @property {statusNotificationObject} state - The state for status notification
 * (see {@link statusNotificationObject})
 * @property {string} statusType - Type of action for PASS
 * @property {string} defaultMessage - Default notification message when inactive
 * @property {React.ReactElement} children - JSX Element of the wrapped form
 * @memberof typedefs
 */

/**
 * An object that stores the user's name and their Pod URL
 *
 * @exports userListObject
 * @typedef userListObject
 * @type {object}
 * @property {string} person - Full name of user
 * @property {string} givenName - First/given name of user
 * @property {string} familyName - Last/family name of user
 * @property {URL} podURL - URL of user's Solid Pod
 * @property {Date|null} dateModified - The last active date using PASS
 * @memberof typedefs
 */

exports.unused = {};
