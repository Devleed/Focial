import Axios from 'axios';
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  GET_ERRORS,
  CLEAR_ERRORS,
  SEARCH_RESULTS,
  SEARCH_RESULTS_FAIL,
  USER_LOAD_FAIL,
  REGISTER_FAIL,
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
  COMMENT_POST,
  POST_LOADING,
  COMMENT_LOADED,
  SEND_REQUEST,
  REQUEST_ACCEPTED,
  REQUEST_REJECTED,
  CANCEL_REQUEST,
  DELETE_POST,
  EDIT_POST,
  SHARE_POST,
  SHARING,
  POSTING,
  DELETING,
  UPDATE_PROFILE,
  GET_FRIENDS,
  GET_NOTIFICATION,
  SELECTED_POST
} from './actionTypes';

export const findPost = id => async dispatch => {
  try {
    const { data } = await Axios.get(`/api/post/${id}`);
    dispatch({ type: SELECTED_POST, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const createNotification = async ({ type, content, id, token }) => {
  try {
    const { data } = await Axios.post(
      `/api/notification/${id}`,
      { type, content },
      getConfig(token)
    );
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

export const getNotification = () => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      '/api/notification',
      getConfig(getState().auth.token)
    );
    dispatch({ type: GET_NOTIFICATION, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const getFriends = (id, limit) => async dispatch => {
  try {
    const { data } = await Axios.get(`/api/user/get-friends/${id}/${limit}`);
    dispatch({ type: GET_FRIENDS, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const getSearchResults = async term => {
  try {
    const res = await Axios.get(`/api/user/fuzzy-search?term=${term}`);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const updateProfilePicture = (picture, cb) => async (
  dispatch,
  getState
) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  if (getState().auth.token) {
    config.headers['Authorization'] = getState().auth.token;
  }
  try {
    const formData = new FormData();
    formData.append('photo', picture);

    const { data } = await Axios.put(
      '/api/user/update/profile/picture',
      formData,
      config
    );
    dispatch({ type: UPDATE_PROFILE, payload: data });
    dispatch({ type: VISITED_USER, payload: data });
    cb();
  } catch (err) {
    console.error(err);
  }
};

export const sharePost = (id, body) => async (dispatch, getState) => {
  try {
    const { data } = await Axios.put(
      `/api/post/share/${id}`,
      { postContent: body },
      getConfig(getState().auth.token)
    );
    console.log(data);
    dispatch({ type: SHARE_POST, payload: data });
    dispatch({ type: SHARING, payload: false });
  } catch (err) {
    console.error(err);
  }
};

export const loadComments = (id, setCommentLoading) => async dispatch => {
  try {
    console.log('ran');
    const { data } = await Axios.get(`/api/post/comment/${id}`);
    setCommentLoading(false);
    dispatch({ type: COMMENT_LOADED, payload: data });
  } catch (err) {
    console.error(err);
  }
};

export const commentPost = (id, comment) => async (dispatch, getState) => {
  try {
    const { data } = await Axios.post(
      `/api/post/comment/${id}`,
      { comment },
      getConfig(getState().auth.token)
    );
    dispatch({ type: COMMENT_POST, payload: data });
    const opts = {
      id,
      type: 'comment',
      content: 'commented on your post',
      token: getState().auth.token
    };
    await createNotification(opts);
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

export const likePost = (id, notify) => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      `/api/post/like/${id}`,
      getConfig(getState().auth.token)
    );
    dispatch({ type: LIKE_POST, payload: data });
    console.log(notify);
    if (notify) {
      const opts = {
        id,
        type: 'like',
        content: 'liked your post',
        token: getState().auth.token
      };
      await createNotification(opts);
    }
  } catch (err) {
    console.error(err);
  }
};

export const editPost = (id, body, setEditing, setLoading) => async (
  dispatch,
  getState
) => {
  try {
    const { data } = await Axios.put(
      `/api/post/${id}`,
      { postBody: body },
      getConfig(getState().auth.token)
    );
    setLoading(false);
    dispatch({ type: EDIT_POST, payload: data });
    setEditing(false);
  } catch (err) {
    console.error(err);
  }
};

export const deletePost = (id, image_id) => async (dispatch, getState) => {
  try {
    const { data } = await Axios.delete(
      `/api/post/${id}/${image_id}`,
      getConfig(getState().auth.token)
    );
    console.log(data);
    dispatch({ type: DELETING, payload: false });
    dispatch({ type: DELETE_POST, payload: data });
  } catch (err) {
    console.error(err.response);
  }
};

export const createPost = ({ postField, postImageField }) => async (
  dispatch,
  getState
) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  if (getState().auth.token) {
    config.headers['Authorization'] = getState().auth.token;
  }
  try {
    console.log(postField);
    const formData = new FormData();
    formData.append('postBody', postField);
    formData.append('photo', postImageField);

    const { data } = await Axios.post('/api/post', formData, config);
    dispatch({ type: CREATE_POST, payload: data });
    dispatch({ type: POSTING, payload: false });
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
    dispatch({ type: POST_LOADING, payload: false });
  } catch (err) {
    console.error(err.response);
    dispatch({ type: POST_LOADING, payload: false });
  }
};

export const unfriendUser = (visitedUserID, loggedUserID, setLoading) => async (
  dispatch,
  getState
) => {
  try {
    const { data } = await Axios.post('/api/user/unfriend', {
      visitedUserID,
      loggedUserID
    });
    dispatch(loadUser(getState().auth.token));
    dispatch(findUser(visitedUserID));
    setLoading(false);
  } catch (err) {
    setLoading(false);
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
    console.log(err.response);
    // dispatch(
    //   returnError(err.response.data, err.response.status, 'request_error')
    // );
  }
};

export const rejectRequest = (
  visitedUserID,
  loggedUserID,
  setLoading
) => async dispatch => {
  try {
    const { data } = await Axios.post('/api/request/rejected', {
      visitedUserID,
      loggedUserID
    });
    dispatch(loadUser());
    dispatch({ type: REQUEST_REJECTED, payload: data });
    setLoading(false);
  } catch (err) {
    setLoading(false);
    return returnError();
  }
};

export const acceptRequest = (
  visitedUserID,
  loggedUserID,
  setLoading
) => async dispatch => {
  try {
    const { data } = await Axios.post('/api/request/accepted', {
      visitedUserID,
      loggedUserID
    });
    dispatch(loadUser());
    dispatch({ type: REQUEST_ACCEPTED, payload: data });
    setLoading(false);
  } catch (err) {
    setLoading(false);
    return returnError();
  }
};

export const sendRequest = (
  visitedUserID,
  loggedUserID,
  setLoading
) => async dispatch => {
  try {
    const { data } = await Axios.post('/api/request', {
      visitedUserID,
      loggedUserID
    });
    dispatch({ type: SEND_REQUEST, payload: data });
    setLoading(false);
  } catch (err) {
    setLoading(false);
    console.log(err);
    // return returnError(
    //   err.response.msg,
    //   err.response.status,
    //   SEND_REQUEST_FAIL
    // );
  }
};

export const deleteRequest = (
  visitedUserID,
  loggedUserID,
  setLoading
) => async dispatch => {
  try {
    const { data } = await Axios.post('/api/request/cancel', {
      visitedUserID,
      loggedUserID
    });
    dispatch({ type: CANCEL_REQUEST, payload: data });
    setLoading(false);
  } catch (err) {
    setLoading(false);
    return returnError();
  }
};

export const searchUser = (name, cb) => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      `/api/user/search?name=${name}`,
      getConfig(getState().auth.token)
    );
    cb(false);
    dispatch({ type: SEARCH_RESULTS, payload: data.searchResults });
  } catch (err) {
    if (err)
      if (err.response)
        return returnError(
          err.response.data.msg,
          err.response.status,
          SEARCH_RESULTS_FAIL
        );
  }
};

export const registerUser = (
  { name, email, password },
  { setLoading, redirect }
) => async dispatch => {
  try {
    const res = await Axios.post('/api/user/register', {
      name,
      email,
      password
    });
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch({ type: POST_LOADING, payload: true });
    dispatch(getPost());
    dispatch(checkRequest());
    dispatch(getNotification());
    redirect('/');
  } catch (err) {
    if (err)
      if (err.response)
        dispatch(
          returnError(err.response.data.msg, err.response.status, REGISTER_FAIL)
        );
  } finally {
    setLoading(false);
  }
};

export const loadUser = () => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(
      '/api/user',
      getConfig(getState().auth.token)
    );
    dispatch({ type: POST_LOADING, payload: true });
    dispatch(getPost());
    dispatch({ type: LOAD_USER, payload: data });
    dispatch({ type: USER_LOADING, payload: false });
    dispatch(checkRequest());
    dispatch(getNotification());
  } catch (err) {
    dispatch({ type: USER_LOADING, payload: false });
    dispatch({ type: USER_LOAD_FAIL });
    // dispatch(
    //   returnError(err.response.data, err.response.status, USER_LOAD_FAIL)
    // );
  }
};

export const loginUser = (
  { email, password },
  history,
  setLoading
) => async dispatch => {
  try {
    const res = await Axios.post('/api/user/login', { email, password });
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch({ type: POST_LOADING, payload: true });
    dispatch(getPost());
    dispatch(checkRequest());
    dispatch(getNotification());
    dispatch(clearError());
    history.push('/');
  } catch (err) {
    setLoading(false);
    if (err)
      if (err.response) {
        dispatch(
          returnError(err.response.data.msg, err.response.status, LOGIN_FAIL)
        );
      }
  }
};

export const sendResetEmail = async email => {
  try {
    console.log(email);
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

export const calculateDate = date => {
  let dateNow = new Date(Date.now());
  let time, form;
  time = (dateNow - new Date(date)) / 1000;
  console.log(time);
  form = 'seconds';
  if (time > 60) {
    time = time / 60;
    form = 'minutes';
  }
  if (time > 60) {
    time = time / 60;
    form = 'hours';
  }
  if (time > 24) {
    time = time / 24;
    form = 'days';
  }
  if (time > 30) {
    return date.toLocaleString('en-us');
  }
  return `${Math.floor(time)} ${form}`;
};
