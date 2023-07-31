export const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'DELETE_NOTIFICATION':
      const updatedNotifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
      return { ...state, notifications: updatedNotifications };
    default:
      throw new Error(`Can not ${action.type}`);
  }
};
