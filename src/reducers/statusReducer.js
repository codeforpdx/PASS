/**
 * @typedef {import('../typedefs').statusNotificationObject} statusNotificationObject
 */

/**
 * The reducers module contains Redux-like reducers that assist with status
 * notifications
 *
 * @namespace reducers
 */

/**
 * Initial state for useStatusNotification hook (see
 * {@link statusNotificationObject})
 *
 * @memberof reducers
 * @name initialStatusState
 * @type {statusNotificationObject}
 */

export const initialStatusState = {
  documentUrl: null,
  message: '',
  timeoutID: null,
  file: null,
  processing: false,
  verifyFile: false
};

/**
 * @memberof reducers
 * @function statusReducer
 * @param {statusNotificationObject} state - The state for status notification
 * (see {@link statusNotificationObject})
 * @param {object} action - useReducer Object for useReducer hook containing
 * action.payload for useStatusNotification hook
 * @returns {statusNotificationObject} state - The updated state based on
 * useReducer action
 */

const statusReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DOCUMENT_LOCATION':
      return { ...state, documentUrl: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_TIMEOUT_ID':
      return { ...state, timeoutID: action.payload };
    case 'SET_PROCESSING':
      return { ...state, processing: true };
    case 'TOGGLE_VERIFY_FILE':
      return { ...state, verifyFile: !state.verifyFile };
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
    case 'CLEAR_VERIFY_FILE':
      return { ...state, verifyFile: false };
    default:
      return initialStatusState;
  }
};

export default statusReducer;
