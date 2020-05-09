import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';

import { loadUser } from '../helpers';
import ResetPasswordParent from './ResetPasswordParent';
import ResetPassword from './ResetPassword';
import { USER_LOADING, SET_SOCKET } from '../helpers/actionTypes';
import Homepage from './Homepage';
import '../styles/base.css';
import SearchResults from './SearchResults';
import ProfileDisplay from './ProfileDisplay';
import PostDisplay from './HomeComponents/Post Components/PostDisplay';
import Auth from './Auth';
import Chat from './ChatComponents/Chat';
import StillWorking from './StillWorking';
import FeaturesList from './FeasturesList';

let socket;

/**
 * MAIN COMPONENT
 * - responsible for managing routes
 * - basic app setup
 * - startup of app
 */
const App = () => {
  const dispatch = useDispatch();
  // setting backend endpoint
  const ENDPOINT = 'localhost:5000';

  // on component mount
  useEffect(() => {
    (() => {
      // set up socket io
      socket = io(ENDPOINT);
      dispatch({ type: SET_SOCKET, payload: socket });

      // try to load user
      dispatch({ type: USER_LOADING, payload: true });
      dispatch(loadUser());
    })();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/auth" exact component={Auth} />
        <Route path="/forget-password" exact component={ResetPasswordParent} />
        <Route path="/search/:term" exact component={SearchResults} />
        <Route path="/reset/:token" exact component={ResetPassword} />
        <Route path="/user/:id" exact component={ProfileDisplay} />
        <Route path="/post/:id" exact component={PostDisplay} />
        <Route path="/chats" exact component={Chat} />
        <Route path="/about" exact component={FeaturesList} />
        <Route path="*" exact component={StillWorking} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
