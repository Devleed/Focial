import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import '../styles/navbar.css';
import {
  LOGOUT_SUCCESS,
  RESET_REQUESTS,
  RESET_POSTS,
  POST_LOADING
} from '../helpers/actionTypes';
import Search from './Search';
import RequestManager from './RequestManager';
import { getPost } from '../helpers';
import { Icon, Dropdown } from 'semantic-ui-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedin = useSelector(({ auth }) => auth.isAuthorized);
  const userLoading = useSelector(({ auth }) => auth.userLoading);
  const user = useSelector(({ auth }) => auth.user);

  const renderAuthButtons = () => {
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
        <Icon name="accusoft" size="small" />
        <p>vance</p>
      </NavLink>
      <Search />
      <NavLink
        to={`/user/${user._id}`}
        className="logo"
        style={{
          fontSize: '16px',
          padding: '0 20px',
          borderRight: '2px solid rgba(199, 199, 199, 0.796)',
          marginRight: '20px'
        }}
      >
        <div className="small-picture" style={{ marginRight: '10px' }}>
          <img src={user.profile_picture} />
        </div>
        {user.name}
      </NavLink>
      <Dropdown icon="bell"></Dropdown>
      <Dropdown icon="facebook messenger"></Dropdown>
      <RequestManager />
      <Dropdown icon="cog"></Dropdown>
      <div className="auth_buttons">{renderAuthButtons()}</div>
    </div>
  );
};

export default Navbar;
