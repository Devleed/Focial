import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './authReducer';
import error from './errorReducer';
import emails from './emailReducer';
import searchResults from './searchReducer';
import requests from './requestReducer';
import visitedUser from './visitedUserReducer';
import loading from './loadingReducer';
import postsData from './postReducer';

export default combineReducers({
  form: formReducer,
  auth,
  error,
  emails,
  searchResults,
  requests,
  visitedUser,
  loading,
  postsData
});
