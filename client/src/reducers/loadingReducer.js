import { SHARING, POSTING, DELETING } from '../helpers/actionTypes';

const INITIAL_STATE = {
  key: null,
  loading: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHARING:
      return { key: SHARING, loading: action.payload };
    case POSTING:
      return { key: POSTING, loading: action.payload };
    case DELETING:
      return { key: DELETING, loading: action.payload };
    default:
      return state;
  }
};
