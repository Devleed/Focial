import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux';

import Login from './Login';
import Register from './Register';
import { loadUser, getAllEmails, returnError, clearError } from '../helpers';
import ResetPasswordParent from './ResetPasswordParent';
import ResetPassword from './ResetPassword';
import { USER_LOADING, USER_LOAD_FAIL } from '../helpers/actionTypes';
import Homepage from './Homepage';
import '../styles/base.css';

const App = () => {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        const allEmails = await getAllEmails();
        if (allEmails.type === 'err') throw allEmails.err;
        else dispatch(allEmails);
        dispatch({ type: USER_LOADING, payload: true });
        const data = await loadUser(store.getState().auth.token);
        if (data.type === 'err') throw data.err;
        else {
          dispatch(data);
        }
        dispatch(clearError());
      } catch (err) {
        dispatch({ type: USER_LOADING, payload: false });
        dispatch({ type: USER_LOAD_FAIL });
        if (err.response)
          dispatch(returnError(err.response.data.msg, err.response.status));
      }
    })();
  }, [dispatch, store]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/forget-password" exact component={ResetPasswordParent} />
        <Route path="/reset/:token" exact component={ResetPassword} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
