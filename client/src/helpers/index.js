import Axios from 'axios';
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOAD_USER,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_EMAILS
} from './actionTypes';

export const getAllEmails = async () => {
  try {
    const res = await Axios.get('/api/user/getEmails');
    return { type: GET_EMAILS, payload: res.data };
  } catch (error) {
    alert('server error');
  }
};

export const registerUser = async ({ name, email, password }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await Axios.post('/api/user/register', body, config);
    return { type: REGISTER_SUCCESS, payload: res.data };
  } catch (err) {
    return { type: 'err', err };
  }
};

export const loadUser = async token => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token) {
    config.headers['Authorization'] = token;
  }
  try {
    const res = await Axios.get('/api/user', config);
    return { type: LOAD_USER, payload: res.data };
  } catch (err) {
    return { type: 'err', err };
  }
};

export const loginUser = async ({ email, password }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await Axios.post('/api/user/login', body, config);
    return { type: LOGIN_SUCCESS, payload: res.data };
  } catch (err) {
    return { type: 'err', err };
  }
};

export const sendResetEmail = async email => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email });
  try {
    const res = await Axios.post('/api/user/forget-password', body, config);
    return res.data;
  } catch (err) {
    return { type: 'err', err };
  }
};

export const resetPassword = async token => {
  try {
    const res = await Axios.get(`/api/user/reset`, {
      params: { token }
    });
    return res.data;
  } catch (err) {
    return { type: 'err', err };
  }
};

export const resetPasswordViaEmail = async ({ email, password }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await Axios.put(
      '/api/user/resetPasswordViaEmail',
      body,
      config
    );
    return res.data;
  } catch (err) {
    return { type: 'err', err };
  }
};

export const returnError = (msg, status, id) => {
  return { type: GET_ERRORS, payload: { msg, status, id } };
};

export const clearError = () => {
  return { type: CLEAR_ERRORS };
};
