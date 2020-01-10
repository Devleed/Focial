import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import emailReducer from './emailReducer';

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  error: errorReducer,
  emails: emailReducer
});
