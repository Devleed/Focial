import { GET_NOTIFICATION } from '../helpers/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return action.payload;
    default:
      return state;
  }
};
