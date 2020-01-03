import Axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER,
  USER_UNAUTHORIZED,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./actionTypes";

export const registerUser = async ({ name, email, password }) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await Axios.post("/api/user/register", body, config);
    return [{ type: REGISTER_SUCCESS, payload: res.data }];
  } catch (err) {
    return [
      { type: REGISTER_FAIL },
      returnError(err.response.data.msg, err.response.status)
    ];
  }
};

export const loadUser = async token => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  try {
    const res = await Axios.get("/api/user", config);
    return [{ type: LOAD_USER, payload: res.data }];
  } catch (err) {
    return [
      returnError(err.response.data.msg, err.response.status, USER_UNAUTHORIZED)
    ];
  }
};

export const loginUser = async ({ email, password }) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await Axios.post("/api/user/login", body, config);
    return [{ type: LOGIN_SUCCESS, payload: res.data }];
  } catch (err) {
    return [
      { type: LOGIN_FAIL },
      returnError(err.response.data.msg, err.response.status, LOGIN_FAIL)
    ];
  }
};

export const returnError = (msg, status, id) => {
  return { type: GET_ERRORS, payload: { msg, status, id } };
};

export const clearError = () => {
  return { type: CLEAR_ERRORS };
};
