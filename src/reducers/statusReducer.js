/**
 * Initial state for useStatusNotification hook
 * @memberof Forms
 * @name initialStatusState
 * @typedef {Object} useStatusNotificationObject
 * @property {string|null} documentLocation - Location of document URL
 * @property {string} message - Status message for file upload, query, or deletion
 * @property {string|null} timeoutID - Timeout ID for status message
 * @property {function} clearValue - Event handler that clears value set for input element
 */

export const initialStatusState = {
  documentLocation: null,
  message: '',
  timeoutID: null,
  file: null
};

/**
 * @memberof Forms
 * @function statusReducer
 * @param {useStatusNotificationObject} state - the state for status notification
 * @param {Object} action - useReducer Object for useReducer hook containing action.payload for useStatusNotification hook
 * @return {useStatusNotificationObject} state - The updated state based on useReducer action
 */

const statusReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DOCUMENT_LOCATION':
      return { ...state, documentLocation: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_TIMEOUT_ID':
      return { ...state, timeoutID: action.payload };
    case 'SET_FILE':
      return { ...state, file: action.payload };
    case 'CLEAR_DOCUMENT_LOCATION':
      return initialStatusState;
    case 'CLEAR_MESSAGE':
      return initialStatusState;
    case 'CLEAR_TIMEOUT_ID':
      return initialStatusState;
    case 'CLEAR_FILE':
      return initialStatusState;
    default:
      throw new Error('No action');
  }
};

export default statusReducer;
