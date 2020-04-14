import React, { useState } from 'react';

import { reduxForm, Field } from 'redux-form';
import { Form, Message } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from './Loader';
import OverlayLoader from './OverlayLoader';
import { loginUser } from '../helpers';
import { LOGIN_FAIL } from '../helpers/actionTypes';
import { Link, Redirect } from 'react-router-dom';
import '../styles/authStyle.css';

// function to display fields
const renderInput = ({
  input,
  type,
  placeholder,
  meta: { touched, error },
}) => {
  let style;
  if (touched && error) {
    style = {
      border: '1px solid #FFA6A6',
      // backgroundColor: '#FFEDED'
    };
  }
  return (
    <div>
      <input {...input} style={style} placeholder={placeholder} type={type} />
      {touched && error && (
        <Message className="negative_message-style">{error}</Message>
      )}
    </div>
  );
};

// function to validate fields
const validate = (values) => {
  let errors = {};
  if (!values.email) errors.email = 'Enter email';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    errors.email = 'Invalid email';
  if (!values.password) errors.password = 'Enter password';
  return errors;
};

/**
 * MAIN COMPONENT
 * - responsible for displaying and managing login submission
 */
const Login = (props) => {
  const dispatch = useDispatch();
  // select error from redux store
  const error = useSelector(({ error }) => error);
  // select if user is logged in
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);
  // select if user is being fetched
  const userLoading = useSelector(({ auth }) => auth.userLoading);

  // using state to store loading state
  const [loading, setLoading] = useState(false);

  // function to perform when form is submitted
  const onFormSubmit = (values) => {
    // set loading to be true
    setLoading(true);
    dispatch(loginUser(values, props.history, setLoading));
  };
  const renderPage = () => {
    // if user is already logged in redirect to homepage
    if (isLoggedIn) return <Redirect to={{ pathname: '/' }} />;
    // if user is loading show loader
    if (userLoading) {
      return <Loader />;
    } else {
      return (
        <Form onSubmit={props.handleSubmit(onFormSubmit)} className="formStyle">
          {loading ? <OverlayLoader /> : null}
          <h1>Login</h1>
          <Form.Field>
            <Field
              name="email"
              component={renderInput}
              type="email"
              placeholder="email"
            />
          </Form.Field>
          <Form.Field>
            <Field
              name="password"
              component={renderInput}
              type="password"
              placeholder="password"
            />
          </Form.Field>
          {error.id === LOGIN_FAIL ? (
            <Message className="negative_message-style">{error.msg}</Message>
          ) : null}
          <Link to="/forget-password" className="authLinkStyle">
            Forgot your password?
          </Link>
          <br />
          <button
            type="submit"
            className="button"
            style={{ marginBottom: '20px' }}
          >
            Submit
          </button>
          <br />
          <button
            className="authLinkStyle"
            onClick={() => props.setLogin(false)}
          >
            create account
          </button>
        </Form>
      );
    }
  };
  return renderPage();
};

// powered by redux forms
export default reduxForm({
  form: 'login form',
  validate,
})(Login);
