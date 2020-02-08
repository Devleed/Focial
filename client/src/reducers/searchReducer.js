import {
  SEARCH_RESULTS,
  RESET_RESULTS,
  SEARCH_RESULTS_FAIL
} from '../helpers/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case SEARCH_RESULTS:
      return action.payload;
    case SEARCH_RESULTS_FAIL:
    case RESET_RESULTS:
      return [];
    default:
      return state;
  }
};
