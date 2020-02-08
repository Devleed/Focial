import { LOADING } from '../helpers/actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case LOADING:
      return action.payload;
    default:
      return state;
  }
};
