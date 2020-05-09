import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import '../styles/navbar.css';
import {
  LOGOUT_SUCCESS,
  RESET_REQUESTS,
  RESET_POSTS,
  POST_LOADING,
} from '../helpers/actionTypes';
import Search from './Search';
import RequestManager from './RequestManager';
import { getPost } from '../helpers';
import { Icon, Dropdown } from 'semantic-ui-react';
import NotificationManager from './NotificationManager';
import ChatManager from './ChatManager';

/**
 * MAIN COMPONENT
 * - responsible for displaying navbar and manage navigation
 */
const Navbar = () => {
  const dispatch = useDispatch();
  // select if user is logged in
  const isLoggedin = useSelector(({ auth }) => auth.isAuthorized);
  // select if user is being fetched
  const userLoading = useSelector(({ auth }) => auth.userLoading);
  // select logged in user
  const user = useSelector(({ auth }) => auth.user);

  // function to render authentication buttons
  const renderAuthButtons = () => {
    // if user is loading return null
    if (userLoading || userLoading === null) {
      return null;
    } else {
      return (
        <ul className="list_items">
          {isLoggedin ? (
            <NavLink
              to="/"
              onClick={() => {
                dispatch({ type: RESET_POSTS });
                dispatch({ type: RESET_REQUESTS });
                dispatch({ type: LOGOUT_SUCCESS });
              }}
            >
              Logout
            </NavLink>
          ) : (
            <React.Fragment>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </React.Fragment>
          )}
        </ul>
      );
    }
  };

  return (
    <div className="navbar">
      <NavLink
        to="/"
        className="logo"
        onClick={() => {
          dispatch({ type: POST_LOADING, payload: true });
          dispatch(getPost());
        }}
      >
        <Icon name="fonticons" size="small" className="logo_icon" />
      </NavLink>
      <Search />
      <NavLink
        to={`/user/${user._id}`}
        className="logo"
        style={{
          fontSize: '16px',
          padding: '0 20px',
          borderRight: '2px solid rgba(199, 199, 199, 0.796)',
          margin: ' 0 20px 5px 0',
        }}
      >
        {user.profile_picture ? (
          <div className="small-picture" style={{ marginRight: '10px' }}>
            <img src={user.profile_picture} />
          </div>
        ) : (
          <Icon name="user" />
        )}
        {user.name}
      </NavLink>
      <div className="stuff" style={{ position: 'relative' }}>
        <NotificationManager />
        <ChatManager />
        <RequestManager style={{ position: 'relative' }} />
        <Dropdown icon="cog"></Dropdown>
      </div>
      <div className="auth_buttons" style={{ float: 'right' }}>
        {renderAuthButtons()}
      </div>
    </div>
  );
};

export default Navbar;
