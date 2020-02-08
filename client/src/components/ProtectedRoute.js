import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from 'semantic-ui-react';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);
  const userLoading = useSelector(({ auth }) => auth.userLoading);

  return (
    <Route
      {...rest}
      render={props => {
        if (userLoading) {
          return <Loader active />;
        } else if (isLoggedIn) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
