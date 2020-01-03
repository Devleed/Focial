import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOAD_USER,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS
} from "../helpers/actionTypes";

const INITIAL_STATE = {
  token: localStorage.getItem("token"),
  isAuthorized: null,
  user: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthorized: true
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        token: null,
        isAuthorized: false,
        user: null
      };
    case LOAD_USER:
      return {
        ...state,
        ...action.payload,
        isAuthorized: true
      };
    default:
      return state;
  }
};
