import { useReducer } from 'react';
import statusReducer, { initialStatusState } from '../reducers/statusReducer';

/**
 * @typedef {import('../typedefs').statusNotificationObject} statusNotificationObject
 */

/**
 * @typedef {import('../typedefs').useStatusNotificationObject} useStatusNotificationObject
 */

/**
 * Custom hook that provides the statusNotificationObject as the state and a
 * useReducer dispatch function to alter the state
 *
 * @memberof hooks
 * @function useStatusNotification
 * @returns {useStatusNotificationObject} useStatusNotificationObject - An
 * object that contains the StatusNotification state (see
 * {@link statusNotificationObject}) and React's useReducer dispatch function
 */
const useStatusNotification = () => {
  const [state, dispatch] = useReducer(statusReducer, initialStatusState);

  return { state, dispatch };
};

export default useStatusNotification;
