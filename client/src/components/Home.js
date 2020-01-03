import React from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { LOGOUT_SUCCESS } from '../helpers/actionTypes';

const Home = () => {
  const dispatch = useDispatch();
  const isLoggedin = useSelector(({ auth }) => auth.isAuthorized);
  return (
    <Menu>
      Home
      {isLoggedin ? (
        <Menu.Menu position="right">
          <Menu.Item>
            <Button onClick={() => dispatch({ type: LOGOUT_SUCCESS })}>
              Logout
            </Button>
          </Menu.Item>
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item>
            <Button>
              <Link to="/login">Login</Link>
            </Button>
          </Menu.Item>
        </Menu.Menu>
      )}
      <Menu.Item>
        <Button>
          <Link to="/register">Register</Link>
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default Home;
