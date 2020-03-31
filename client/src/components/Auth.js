import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = props => {
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
