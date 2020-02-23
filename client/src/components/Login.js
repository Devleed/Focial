import React from 'react';

import { reduxForm, Field } from 'redux-form';
import { Form, Header, Message, Container, Loader } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { loginUser } from '../helpers';
import { LOGIN_FAIL, LOADING } from '../helpers/actionTypes';
import { Link, Redirect } from 'react-router-dom';
import '../styles/authStyle.css';

let allEmails = [];

const renderInput = ({
  input,
  type,
  placeholder,
  meta: { touched, error }
}) => {
  let style;
  if (touched && error) {
    style = {
      border: '1px solid #FFA6A6'
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

const validate = values => {
  let errors = {};
  if (!values.email) errors.email = 'Enter email';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    errors.email = 'Invalid email';
  else if (!allEmails.includes(values.email)) errors.email = 'No user found';
  if (!values.password) errors.password = 'Enter password';
  return errors;
};

const Login = props => {
  const dispatch = useDispatch();
  const error = useSelector(({ error }) => error);
  const emails = useSelector(({ emails }) => emails);
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);
  const loading = useSelector(({ loading }) => loading);
  const userLoading = useSelector(({ auth }) => auth.userLoading);

  allEmails = emails;

  const onFormSubmit = values => {
    dispatch({ type: LOADING, payload: true });
    dispatch(loginUser(values, props.history));
  };
  const renderPage = () => {
    if (isLoggedIn) return <Redirect to={{ pathname: '/' }} />;
    if (userLoading) {
      return <Loader active />;
    } else {
      return (
        <Form
          loading={loading}
          onSubmit={props.handleSubmit(onFormSubmit)}
          className="formStyle"
        >
          <Header as="h1" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            Login
          </Header>
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
          <Link to="/register" className="authLinkStyle">
            create account
          </Link>
        </Form>
      );
    }
  };
  return <Container className="containerStyle">{renderPage()}</Container>;
};

export default reduxForm({
  form: 'login form',
  validate
})(Login);
