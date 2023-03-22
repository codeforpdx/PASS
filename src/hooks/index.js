/**
 * The hooks module contains custom hooks to assist with form handling or status notifications
 * @namespace hooks
 */

import { useReducer, useState } from 'react';
import statusReducer, { initialStatusState } from '../reducers/statusReducer';

/**
 * @typedef {Object} useFieldObject
 * @property {String} type - Type attribute of HTML input element
 * @property {String} value - The value of input element
 * @property {Function} onChange - Event handler for changes in input element
 * @property {Function} clearValue - Event handler that clears value set for input element
 */

/**
 * Custom hook that provide the value of input element, type attribute of HTML input element,
 * set value of input element onChange, and a clear value function
 * @memberof hooks
 * @function useField
 * @param {String} type - Type attribute of HTML input element
 * @return {useFieldObject} useFieldObject - An object that contains { type, value, onChange, clearValue }
 */

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const clearValue = () => {
    setValue('');
  };

  return {
    type,
    value,
    onChange,
    clearValue
  };
};

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
 * @typedef {Object} useStatusNotificationObject
 * @property {statusNotificationObject} statusNotificationObject - An object consisting of the
 * state for status notifications
 * @property {React.DispatchWithoutAction} dispatch - React's useReducer dispatch function
 */

/**
 * Custom hook that provide the useStatusNotificationObject as the state and a
 * useReducer dispatch function to alter the state
 * @memberof hooks
 * @function useStatusNotification
 * @return {useStatusNotificationObject} useStatusNotificationObject - An object that
 * contains the StatusNotification state and React's useReducer dispatch function
 */

export const useStatusNotification = () => {
  const [state, dispatch] = useReducer(statusReducer, initialStatusState);

  return { state, dispatch };
};
