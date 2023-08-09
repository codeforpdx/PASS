import React, { createContext, useReducer, useMemo } from 'react';
import notificationReducer from '../reducers/notificationReducer';

const initialState = {
  notifications: []
};

export const NotificationContext = createContext(initialState);

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (severity, message) => {
    const id = Math.floor(Math.random() * 10000000);
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, severity } });
  };

  const remove = (id) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  };

  const notificationObject = useMemo(
    () => ({
      addNotification,
      remove,
      state
    }),
    [state]
  );

  return (
    <NotificationContext.Provider value={notificationObject}>
      {children}
    </NotificationContext.Provider>
  );
};
