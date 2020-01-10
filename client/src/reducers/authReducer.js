import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOAD_USER,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  USER_LOADING,
  USER_LOAD_FAIL
} from '../helpers/actionTypes';

const INITIAL_STATE = {
  token: localStorage.getItem('token'),
  isAuthorized: null,
  user: null,
  userLoading: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        userLoading: action.payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthorized: true,
        userLoading: false
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case USER_LOAD_FAIL:
      localStorage.removeItem('token');
      return {
        token: null,
        isAuthorized: false,
        user: null,
        userLoading: false
      };
    case LOAD_USER:
      return {
        ...state,
        ...action.payload,
        isAuthorized: true,
        userLoading: false
      };
    default:
      return state;
  }
};
