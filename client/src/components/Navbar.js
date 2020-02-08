import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import '../styles/navbar.css';
import { LOGOUT_SUCCESS } from '../helpers/actionTypes';
import Search from './Search';

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedin = useSelector(({ auth }) => auth.isAuthorized);
  const userLoading = useSelector(({ auth }) => auth.userLoading);

  const renderAuthButtons = () => {
    if (userLoading || userLoading === null) {
      return null;
    } else {
      return (
        <ul className="list_items">
          {isLoggedin ? (
            <NavLink to="/" onClick={() => dispatch({ type: LOGOUT_SUCCESS })}>
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
      <h1 className="logo">Logo</h1>
      <Search />
      <div>{renderAuthButtons()}</div>
    </div>
  );
};

export default Navbar;
