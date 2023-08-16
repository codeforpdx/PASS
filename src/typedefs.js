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
 * @property {string|null} [filename] - Name of the file being processed
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
 * @property {File|null} [file] - File object to be uploaded, if chosen, else
 * returns null
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
 * @property {File|null} [file] - File object, if chosen for upload, else return
 * null
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
 * newMessageModalProps is an object that stores the props for the NewMessageModal
 * component
 *
 * @exports newMessageModalProps
 * @typedef {object} newMessageModalProps
 * @property {boolean} showModal - Boolean for showing message modal
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowModal
 * - React set function for showModal
 * @property {object|string} oldMessage - The previous message when using the modal to reply,
 * uses a string if empty
 * @memberof typedefs
 */

/**
 * loadingAnimationProps is an object that stores the props for the LoadingAnimation
 * component; By default LinearProgress will be used as the default animation,
 * if used as a provider, i.e. wrapping children animation components, the wrapped
 * component will be used instead for animation
 *
 * @exports loadingAnimationProps
 * @typedef {object} loadingAnimationProps
 * @property {string} loadingItem - The name of what you plan on loading
 * @property {React.JSX.Element} children - If used as a provider, wrapped component
 * will be used as the animation
 * @memberof typedefs
 */

/**
 * clientListTableProps is an object that stores the props for the
 * ClientListTable component
 *
 * @exports clientListTableProps
 * @typedef {object} clientListTableProps
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowDeleteClientModal
 * - React set function for DeleteClientModal
 * @property {React.Dispatch<React.SetStateAction<null>>} setSelectedClientToDelete
 * - React set function for setting client to be deleted
 * @memberof typedefs
 */

/**
 * clientListTableRowProps is an object that stores the props for the
 * ClientListTableRow component
 *
 * @exports clientListTableRowProps
 * @typedef {object} clientListTableRowProps
 * @property {object} client - Object containing client information
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowDeleteClientModal
 * - React set function for DeleteClientModal
 * @property {React.Dispatch<React.SetStateAction<null>>} setSelectedClientToDelete
 * - React set function for setting client to be deleted
 * @memberof typedefs
 */

/**
 * uploadDocumentModalProps is an object that stores the props for the
 * UploadDocumentModal component
 *
 * @exports uploadDocumentModalProps
 * @typedef {object} uploadDocumentModalProps
 * @property {boolean} showModal - Boolean for showing upload documents modal
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowModal
 * - React set function for setting showModal state
 * @memberof typedefs
 */

/**
 * documentTableProps is an object that stores the props for the DocumentTable
 * component.
 *
 * @exports documentTableProps
 * @typedef {object} documentTableProps
 * @property {(string) => void} handleModal
 * - Function for setting the correct File Name for the SetAclPermissions Modal, and opening it.
 * @memberof typedefs
 */

/**
 * documentTableRowProps is an object that stores the props for the DocumentTableRow
 * component
 *
 * @exports documentTableRowProps
 * @typedef {object} documentTableRowProps
 * @property {File} document - File object containing the document
 * @property {(string) => void} handleModal
 * - Function for setting the correct File Name for the SetAclPermissions Modal, and opening it.
 * @memberof typedefs
 */

/**
 * profileComponentProps is an object that stores the props for the
 * ProfileComponent component
 *
 * @exports profileComponentProps
 * @typedef {object} profileComponentProps
 * @property {object} [clientProfile] - Client object with data from profile
 * or null if user profile is selected
 * @memberof typedefs
 */

/**
 * profileImageFieldProps is an object that stores the props for the ProfileInputField
 * component
 *
 * @exports profileImageFieldProps
 * @typedef {object} profileImageFieldProps
 * @property {() => void} loadProfileData - Handler function for setting local
 * state for profile card in PASS
 * @property {object} [clientProfile] - Client object with data from profile
 * or null if user profile is selected
 * @memberof typedefs
 */

/**
 * profileInputFieldProps is an object that stores the props for the ProfileInputField
 * component
 *
 * @exports profileInputFieldProps
 * @typedef {object} profileInputFieldProps
 * @property {string} inputName - Name of input field
 * @property {string} inputValue - Value of input field used for updating profile
 * @property {(value: React.SetStateAction<null>) => void} setInputValue - Set
 * function for inputValue
 * @property {boolean} edit - Boolean used to toggle edit inputs
 * @memberof typedefs
 */

/**
 * profileEditButtonGroupProps is an object that stores the props for the
 * ProfileInputField component
 *
 * @exports profileEditButtonGroupProps
 * @typedef {object} profileEditButtonGroupProps
 * @property {string} edit - Boolean state for editing values in the
 * ProfileInputField component
 * @property {() => void} handleCancelEdit - Handler function for canceling edit for
 * ProfileInputField component
 * @property {() => void} handleEditInput - Handler function for editing the
 * ProfileInputField component
 * @memberof typedefs
 */

/**
 * footerProps is an object that stores the props for the Footer subcomponents
 *
 * @exports footerProps
 * @typedef {object} footerProps
 * @property {boolean} isReallySmallScreen - Boolean for if screen is below theme
 * breakdown of 'sm' for MUI
 * @memberof typedefs
 */

/**
 * setAclPermissionsModalProps is an object that stores the props for the setAclPermissionsModal component.
 *
 * @exports setAclPermissionsModalProps
 * @typedef {object} setAclPermissionsModalProps
 * @property {boolean} showModal - Boolean for showing setAclPermissionsModal.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowModal
 * - React set function for setting showModal state
 * @property {object} dataset
 * - State object containing information for which version of modal to display, and
 * a relevant file name, if any.
 * @memberof typedefs
 */

exports.unused = {};
