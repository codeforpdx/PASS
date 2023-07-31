import React, { createContext, useReducer } from 'react';
import  notificationReducer  from '../reducers/notificationReducer';
import NotificationContainer from '../components/Notification/NotificationContainer';

export const NotificationContext = createContext();

const initialState = {
  notifications: []
};

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (severity, message) => {
    const id = Math.floor(Math.random() * 10000000);
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, severity } });
  };

  const remove = (id) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  };
  return (
    <NotificationContext.Provider value={{ addNotification, remove, state }}>
      <NotificationContainer notifications={state.notifications} />
      {children}
    </NotificationContext.Provider>
  );
};
