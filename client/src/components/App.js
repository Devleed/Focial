import React, { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { useDispatch, useStore } from "react-redux";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import { loadUser } from "../helpers";

const App = () => {
  const dispatch = useDispatch();
  const store = useStore();
  useEffect(() => {
    (() => {
      loadUser(store.getState().auth.token)
        .then(data => data.forEach(elem => dispatch(elem)))
        .catch(e => console.log(e));
    })();
  }, [dispatch, store]);
  return (
    <BrowserRouter>
      <Container style={{ marginTop: "60px" }}>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Container>
    </BrowserRouter>
  );
};

export default App;
