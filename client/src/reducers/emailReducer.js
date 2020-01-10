import { GET_EMAILS } from '../helpers/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_EMAILS:
      return action.payload;
    default:
      return state;
  }
};
