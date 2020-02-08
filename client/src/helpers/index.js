import Axios from 'axios';
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_EMAILS,
  GET_EMAILS_FAIL,
  SEARCH_RESULTS,
  SEARCH_RESULTS_FAIL,
  LOGIN_FAIL,
  USER_LOAD_FAIL,
  REGISTER_FAIL,
  SEND_REQUEST_FAIL,
  LOAD_USER,
  PASSWORD_RESET_ERROR,
  REQUEST_RECIEVED,
  REQUEST_SENT,
  USER_LOADING,
  VISITED_USER,
  LOADING,
  GET_POST,
  CREATE_POST,
  LIKE_POST,
  UNLIKE_POST,
  COMMENT_POST
} from './actionTypes';

export const commentPost = (id, comment) => async (dispatch, getState) => {
  try {
    const { data } = await Axios.post(
      `/api/post/comment/${id}`,
      { comment },
      getConfig(getState().auth.token)
    );
    dispatch({ type: COMMENT_POST, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const unlikePost = id => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      `/api/post/unlike/${id}`,
      getConfig(getState().auth.token)
    );
    dispatch({ type: UNLIKE_POST, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const likePost = id => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      `/api/post/like/${id}`,
      getConfig(getState().auth.token)
    );
    dispatch({ type: LIKE_POST, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const createPost = postBody => async (dispatch, getState) => {
  try {
    const { data } = await Axios.post(
      '/api/post',
      { postBody },
      getConfig(getState().auth.token)
    );
    dispatch({ type: CREATE_POST, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const getPost = () => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      '/api/post',
      getConfig(getState().auth.token)
    );
    dispatch({ type: GET_POST, payload: data });
  } catch (err) {
    console.error(err.response);
  }
};

export const unfriendUser = async (visitedUserID, loggedUserID) => {
  try {
    const { data } = await Axios.post('/api/user/unfriend', {
      visitedUserID,
      loggedUserID
    });
    return data;
  } catch (err) {
    returnError();
  }
};

export const findUser = id => async dispatch => {
  try {
    const { data } = await Axios.get(`/api/user/${id}`);
    dispatch({ type: VISITED_USER, payload: data });
  } catch (err) {
    dispatch(returnError());
  }
};

// set up check request
export const checkRequest = () => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      '/api/request',
      getConfig(getState().auth.token)
    );
    dispatch({ type: REQUEST_RECIEVED, payload: data.requestRecieved });
    dispatch({ type: REQUEST_SENT, payload: data.requestSent });
  } catch (err) {
    dispatch(
      returnError(err.response.data, err.response.status, 'request_error')
    );
  }
};

export const rejectRequest = async (visitedUserID, loggedUserID) => {
  try {
    const { data } = await Axios.post('/api/request/rejected', {
      visitedUserID,
      loggedUserID
    });
    console.log(data);
  } catch (err) {
    return returnError();
  }
};

export const acceptRequest = async (visitedUserID, loggedUserID) => {
  try {
    const { data } = await Axios.post('/api/request/accepted', {
      visitedUserID,
      loggedUserID
    });
    console.log(data);
  } catch (err) {
    return returnError();
  }
};

export const sendRequest = async (visitedUserID, loggedUserID) => {
  try {
    const { data } = await Axios.post('/api/request', {
      visitedUserID,
      loggedUserID
    });
    return data;
  } catch (err) {
    return returnError(
      err.response.msg,
      err.response.status,
      SEND_REQUEST_FAIL
    );
  }
};

export const deleteRequest = async (visitedUserID, loggedUserID) => {
  try {
    const { data } = await Axios.post('/api/request/cancel', {
      visitedUserID,
      loggedUserID
    });
    console.log(data);
  } catch (err) {
    return returnError();
  }
};

export const searchUser = name => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      `/api/user/search?name=${name}`,
      getConfig(getState().auth.token)
    );
    dispatch({ type: SEARCH_RESULTS, payload: data.searchResults });
  } catch (err) {
    return returnError(
      err.response.msg,
      err.response.status,
      SEARCH_RESULTS_FAIL
    );
  }
};

export const getAllEmails = () => async dispatch => {
  try {
    const res = await Axios.get('/api/user/getEmails');
    dispatch({ type: GET_EMAILS, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_EMAILS_FAIL });
    dispatch(returnError());
  }
};

export const registerUser = ({ name, email, password }) => async dispatch => {
  try {
    const res = await Axios.post('/api/user/register', {
      name,
      email,
      password
    });
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch(checkRequest());
    dispatch(getPost());
    dispatch({ type: LOADING, payload: false });
  } catch (err) {
    dispatch(
      returnError(err.response.data, err.response.status, REGISTER_FAIL)
    );
  }
};

export const loadUser = () => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      '/api/user',
      getConfig(getState().auth.token)
    );
    dispatch({ type: LOAD_USER, payload: data.user });
    dispatch({ type: USER_LOADING, payload: false });
    dispatch(checkRequest());
    dispatch(getPost());
  } catch (err) {
    dispatch({ type: USER_LOADING, payload: false });
    dispatch({ type: USER_LOAD_FAIL });
    // dispatch(
    //   returnError(err.response.data, err.response.status, USER_LOAD_FAIL)
    // );
  }
};

export const loginUser = ({ email, password }, history) => async dispatch => {
  try {
    const res = await Axios.post('/api/user/login', { email, password });
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(checkRequest());
    dispatch(getPost());
    dispatch({ type: LOADING, payload: false });
    dispatch(getAllEmails());
    dispatch(clearError());
    history.push('/');
  } catch (err) {
    console.log(err.response);
    // dispatch(returnError(err.response.data, err.response.status, LOGIN_FAIL));
  }
};

export const sendResetEmail = async email => {
  try {
    const res = await Axios.post('/api/user/forget-password', { email });
    return res.data;
  } catch (err) {
    return returnError(
      err.response.data,
      err.response.status,
      PASSWORD_RESET_ERROR
    );
  }
};

export const resetPassword = async token => {
  try {
    const res = await Axios.get(`/api/user/reset`, {
      params: { token }
    });
    return res.data;
  } catch (err) {
    return returnError(
      err.response.data,
      err.response.status,
      PASSWORD_RESET_ERROR
    );
  }
};

export const resetPasswordViaEmail = async ({ email, password }) => {
  try {
    const res = await Axios.put('/api/user/resetPasswordViaEmail', {
      email,
      password
    });
    return res.data;
  } catch (err) {
    return returnError(
      err.response.data,
      err.response.status,
      PASSWORD_RESET_ERROR
    );
  }
};

export const returnError = (msg, status, id) => {
  return { type: GET_ERRORS, payload: { msg, status, id } };
};

export const clearError = () => {
  return { type: CLEAR_ERRORS };
};

const getConfig = token => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
};
