import { GET_ERRORS, CLEAR_ERRORS } from "../helpers/actionTypes";

const INITIAL_STATE = {
  msg: null,
  status: null,
  id: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id
      };
    case CLEAR_ERRORS:
      return {
        msg: {},
        status: null,
        id: null
      };
    default:
      return state;
  }
};
