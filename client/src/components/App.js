import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Login from './Login';
import Register from './Register';
import { loadUser, getAllEmails } from '../helpers';
import ResetPasswordParent from './ResetPasswordParent';
import ResetPassword from './ResetPassword';
import { USER_LOADING } from '../helpers/actionTypes';
import Homepage from './Homepage';
import '../styles/base.css';
import SearchResults from './SearchResults';
import ProfileDisplay from './ProfileDisplay';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(getAllEmails());
      dispatch({ type: USER_LOADING, payload: true });
      dispatch(loadUser());
    })();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/forget-password" exact component={ResetPasswordParent} />
        <Route path="/search" exact component={SearchResults} />
        <Route path="/reset/:token" exact component={ResetPassword} />
        <Route path="/user/:id" exact component={ProfileDisplay} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
