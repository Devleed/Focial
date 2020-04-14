import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

/**
 * MAIN COMPONENT
 * - responsible for displaying auth forms by conditions
 */
const Auth = (props) => {
  // using state to know which form to render
  const [login, setLogin] = useState(true);

  return (
    <div className="auth_div">
      <h1>
        Live.
        <br />
        Love.
        <br />
        Enjoy.
        <br />
      </h1>
      {login ? (
        <Login setLogin={setLogin} />
      ) : (
        <Register setLogin={setLogin} history={props.history} />
      )}
    </div>
  );
};

export default Auth;
