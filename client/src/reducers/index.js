import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './authReducer';
import error from './errorReducer';
import searchResults from './searchReducer';
import requests from './requestReducer';
import visitedUser from './visitedUserReducer';
import loading from './loadingReducer';
import postsData from './postReducer';
import notificationData from './notificationReducer';

export default combineReducers({
  form: formReducer,
  auth,
  error,
  searchResults,
  requests,
  visitedUser,
  loading,
  postsData,
  notificationData
});
