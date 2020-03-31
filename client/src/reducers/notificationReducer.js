import {
  GET_NOTIFICATION,
  OPEN_NOTIFICATION,
  LOGOUT_SUCCESS
} from '../helpers/actionTypes';

const INITIAL_STATE = {
  notifications: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return { notifications: action.payload };
    case OPEN_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification => {
          if (notification._id === action.payload._id)
            return { ...notification, ...action.payload };
          else return notification;
        })
      };
    case LOGOUT_SUCCESS:
      return {
        notifications: []
      };
    default:
      return state;
  }
};
