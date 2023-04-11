/**
 * The hooks module contains custom hooks to assist with form handling or status
 * notifications
 *
 * @namespace hooks
 */

import { useEffect, useReducer, useState } from 'react';
import statusReducer, { initialStatusState } from '../reducers/statusReducer';

/**
 * @typedef {import('../typedefs').statusNotificationObject} statusNotificationObject
 */

/**
 * @typedef {import('../typedefs').useFieldObject} useFieldObject
 */

/**
 * @typedef {import('../typedefs').useStatusNotificationObject} useStatusNotificationObject
 */

/**
 * Custom hook that provide the value of input element, type attribute of HTML
 * input element, set value of input element onChange, and a clear value
 * function
 *
 * @memberof hooks
 * @function useField
 * @param {string} type - Type attribute of HTML input element
 * @returns {useFieldObject} useFieldObject - An object that contains { type,
 * value, onChange, clearValue } (see {@link useFieldObject})
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
 * Custom hook that provide the statusNotificationObject as the state and a
 * useReducer dispatch function to alter the state
 *
 * @memberof hooks
 * @function useStatusNotification
 * @returns {useStatusNotificationObject} useStatusNotificationObject - An
 * object that contains the StatusNotification state (see
 * {@link statusNotificationObject}) and React's useReducer dispatch function
 */

export const useStatusNotification = () => {
  const [state, dispatch] = useReducer(statusReducer, initialStatusState);

  return { state, dispatch };
};

/**
 * Custom hook that provides the redirect URL for Solid session login and stores
 * it in localStorage if it doesn't exist there
 *
 * @memberof hooks
 * @function useRedirectUrl
 * @returns {URL} redirectUrl - A string containing the redirect URL for Solid
 * session login
 */

export const useRedirectUrl = () => {
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('redirectUrl')) {
      localStorage.setItem('redirectUrl', window.location.href);
      setRedirectUrl(window.location.href);
    } else {
      setRedirectUrl(localStorage.getItem('redirectUrl'));
    }
  }, [redirectUrl]);

  return redirectUrl;
};
