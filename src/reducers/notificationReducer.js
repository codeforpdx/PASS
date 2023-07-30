export const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'DELETE_NOTIFICATION':
        console.log('delete notification is being called in reducer')
      const updatedNotifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
      return { ...state, notifications: updatedNotifications };
    default:
      throw new Error(`Can not ${action.type}`);
  }
};
