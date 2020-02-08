import { VISITED_USER } from '../helpers/actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case VISITED_USER:
      return action.payload;
    default:
      return state;
  }
};
