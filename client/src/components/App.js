import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Login from './Login';
import Register from './Register';
import { loadUser } from '../helpers';
import ResetPasswordParent from './ResetPasswordParent';
import ResetPassword from './ResetPassword';
import { USER_LOADING } from '../helpers/actionTypes';
import Homepage from './Homepage';
import '../styles/base.css';
import SearchResults from './SearchResults';
import ProfileDisplay from './ProfileDisplay';
import PostDisplay from './HomeComponents/Post Components/PostDisplay';
import Auth from './Auth';

const App = () => {
  const dispatch = useDispatch();

  let bodyInterval;

  useEffect(() => {
    (async () => {
      dispatch({ type: USER_LOADING, payload: true });
      dispatch(loadUser());
    })();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/auth" exact component={Auth} />
        {/* <Route path="/login" exact component={Login} /> */}
        {/* <Route path="/register" exact component={Register} /> */}
        <Route path="/forget-password" exact component={ResetPasswordParent} />
        <Route path="/search/:term" exact component={SearchResults} />
        <Route path="/reset/:token" exact component={ResetPassword} />
        <Route path="/user/:id" exact component={ProfileDisplay} />
        <Route path="/post/:id" exact component={PostDisplay} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
