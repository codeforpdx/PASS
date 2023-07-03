const React = require('react');

/**
 * @namespace typedefs
 */

/**
 * A React props object for the StatusMessage component
 *
 * @exports statusMessageProps
 * @typedef {object} statusMessageProps
 * @property {string} notification - File status message
 * @property {URL} [locationUrl] - URL location of file, if exist
 * @property {string} [filename] - Name of the file being processed
 * @memberof typedefs
 */

/**
 * A React props object for the StatusNotification component
 *
 * @exports statusNotificationProps
 * @typedef {object} statusNotificationProps
 * @property {statusNotificationObject} state - The state used for statusNotification
 * @property {string} statusType - Type of file status (i.e. file upload, file
 * fetch, file delete)
 * @property {string} defaultMessage - Default message when status is not
 * triggered
 * @memberof typedefs
 */

/**
 * An object containing the type, value, onChange function, and clearValue
 * function for the custom useField hook
 *
 * @exports useFieldObject
 * @typedef {object} useFieldObject
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
 * @typedef {object} statusNotificationObject
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
 * @typedef {object} useStatusNotificationObject
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
 * @typedef {object} fileObjectType
 * @property {string} type - Type of document
 * @property {string} date - Date of upload
 * @property {string} description - Description of document
 * @property {object} file - An object which contain information about the file
 * being uploaded as well the document itself
 * @memberof typedefs
 */

/**
 * A React props object for FormSection component
 *
 * @exports formSectionProps
 * @typedef {object} formSectionProps
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
 * @typedef {object} userListObject
 * @property {string} person - Full name of user
 * @property {string} givenName - First/given name of user
 * @property {string} familyName - Last/family name of user
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
 * @memberof typedefs
 */

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @exports messageFolderProps
 * @typedef {object} messageFolderProps
 * @property {string} folderType - The name of the message box, i.e. "inbox" or
 * "outbox"
 * @property {() => Promise<void>} handleRefresh - The handle function for message
 * folder refresh
 * @property {boolean} loadMessages - Boolean for triggering loading message
 * @property {messageListObject[]} messageList - A list of messages from Solid Pod
 * @memberof typedefs
 */

/**
 * messagePreviewProps is an object that stores the props for the MessageFolder
 * component
 *
 * @exports messagePreviewProps
 * @typedef {object} messagePreviewProps
 * @property {string} message - The content of the message sent
 * @property {string} folderType - Type of message box
 * @memberof typedefs
 */

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @exports newMessageProps
 * @typedef {object} newMessageProps
 * @property {() => void} closeForm - The function used to trigger NewMessage to
 * close
 * @memberof typedefs
 */

/**
 * loadingAnimationProps is an object that stores the props for the LoadingAnimation
 * component
 *
 * @exports loadingAnimationProps
 * @typedef {object} loadingAnimationProps
 * @property {string} loadingItem - The name of what you plan on loading
 * @memberof typedefs
 */

exports.unused = {};
