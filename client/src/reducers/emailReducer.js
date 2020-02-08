import { GET_EMAILS, GET_EMAILS_FAIL } from '../helpers/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_EMAILS:
      return [...action.payload];
    case GET_EMAILS_FAIL:
      return state;
    default:
      return state;
  }
};
