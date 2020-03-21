import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
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
      {login ? <Login setLogin={setLogin} /> : <Register setLogin={setLogin} />}
    </div>
  );
};

export default Auth;
