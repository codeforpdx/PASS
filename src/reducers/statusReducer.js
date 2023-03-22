/**
 * The reducers module contains Redux-like reducers that assist with status notifications
 * @namespace reducers
 */

/**
 * @typedef {Object} statusNotificationObject
 * @property {String|null} documentUrl - Url link to document container
 * @property {String} message - Status message for file upload, query, or deletion
 * @property {String|null} timeoutID - Timeout ID for status message
 * @property {Object|null} file - Object that includes file in question
 * @property {Boolean} processing - Boolean on whether application is uploading,
 * fetching, querying data from Solid
 */

/**
 * Initial state for useStatusNotification hook
 * @memberof reducers
 * @name initialStatusState
 * @type {statusNotificationObject}
 */

export const initialStatusState = {
  documentUrl: null,
  message: '',
  timeoutID: null,
  file: null,
  processing: false
};

/**
 * @memberof reducers
 * @function statusReducer
 * @param {statusNotificationObject} state - The state for status notification
 * @param {Object} action - useReducer Object for useReducer hook containing
 * action.payload for useStatusNotification hook
 * @return {statusNotificationObject} state - The updated state based on useReducer action
 */

const statusReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DOCUMENT_LOCATION':
      return { ...state, documentUrl: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_TIMEOUT_ID':
      return { ...state, timeoutID: action.payload };
    case 'SET_FILE':
      return { ...state, file: action.payload };
    case 'SET_PROCESSING':
      return { ...state, processing: true };
    case 'CLEAR_DOCUMENT_LOCATION':
      return { ...state, documentUrl: null };
    case 'CLEAR_MESSAGE':
      return { ...state, message: '' };
    case 'CLEAR_TIMEOUT_ID':
      return { ...state, timeoutID: null };
    case 'CLEAR_FILE':
      return { ...state, file: null };
    case 'CLEAR_PROCESSING':
      return { ...state, processing: false };
    default:
      throw new Error('No action');
  }
};

export default statusReducer;
