/**
 * hooks module contains custom hooks to assist with form handling or session login/logout
 * @namespace hooks
 */

import { useReducer, useState } from "react";
import statusReducer, { initialStatusState } from "../reducers/statusReducer";

/**
 * @typedef {Object} useFieldObject
 * @property {string} type - Type attribute of HTML input element
 * @property {string} value - The value of input element
 * @property {function} onChange - Event handler for changes in input element
 * @property {function} clearValue - Event handler that clears value set for input element
 */

/**
 * Custom hook that provide the value of input element, type attribute of HTML input element, set value of input element onChange, and a clear value function
 * @memberof hooks
 * @function useField
 * @param {string} type - Type attribute of HTML input element
 * @return {useFieldObject} useFieldObject - An object that contains { type, value, onChange, clearValue }
 */

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const clearValue = () => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    clearValue,
  };
};

/**
 * @typedef {Object} useStatusNotificationObject
 * @property {string|null} documentLocation - Location of document URL
 * @property {string} message - Status message for file upload, query, or deletion
 * @property {string|null} timeoutID - Timeout ID for status message
 * @property {function} clearValue - Event handler that clears value set for input element
 */

/**
 * Custom hook that provide the useStatusNotificationObject as the state and a useReducer dispatch function to alter the state
 * @memberof hooks
 * @function useStatusNotification
 * @return {useStatusNotificationObject} useStatusNotificationObject - An object that contains { documentLocation, message, timeoutID, and file }
 */

export const useStatusNotification = () => {
  const [state, dispatch] = useReducer(statusReducer, initialStatusState);

  return { state, dispatch };
};
