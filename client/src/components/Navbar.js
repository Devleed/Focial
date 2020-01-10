import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';

import { LOGOUT_SUCCESS } from '../helpers/actionTypes';

const Home = () => {
  const dispatch = useDispatch();
  const isLoggedin = useSelector(({ auth }) => auth.isAuthorized);
  const userLoading = useSelector(({ auth }) => auth.userLoading);

  console.log(userLoading);

  const renderAuthButtons = () => {
    if (userLoading || userLoading === null) {
      return null;
    } else {
      return (
        <ul className="list_items">
          {isLoggedin ? (
            <li onClick={() => dispatch({ type: LOGOUT_SUCCESS })}>
              <NavLink to="/">Logout</NavLink>
            </li>
          ) : (
            <React.Fragment>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Register</NavLink>
              </li>
            </React.Fragment>
          )}
        </ul>
      );
    }
  };

  return (
    <header className="nav">
      <h1>
        <NavLink to="/" className="logo">
          Logo
        </NavLink>
      </h1>
      <nav>{renderAuthButtons()}</nav>
    </header>
  );
};

export default Home;
