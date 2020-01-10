import React, { useState } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form, Header, Message, Container } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { registerUser, clearError, returnError } from '../helpers';
import { REGISTER_FAIL } from '../helpers/actionTypes';

// global emails variable
let allEmails = [];

// render input fields
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
      <input {...input} placeholder={placeholder} type={type} style={style} />
      {touched && error && (
        <Message negative className="negative_message-style">
          {error}
        </Message>
      )}
    </div>
  );
};

// validate inputs
const validate = values => {
  const errors = {};
  if (!values.name) errors.name = 'Name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    errors.email = 'Invalid email';
  else if (allEmails.includes(values.email))
    errors.email = 'Email already taken';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password === values.name)
    errors.password = "You can't use your name as your password";
  else if (values.password.length < 5)
    errors.password = 'password should be of atleast 5 characters';
  else if (values.password !== values.confirm_password)
    errors.password = "Password dosen't match";
  return errors;
};

/** MAIN COMPONENT */
const Register = props => {
  const dispatch = useDispatch();
  const error = useSelector(({ error }) => error);
  const emails = useSelector(({ emails }) => emails);
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);

  const [loading, setLoading] = useState(false);

  allEmails = emails;

  const onFormSubmit = values => {
    setLoading(true);
    registerUser(values)
      .then(data => {
        if (data.type === 'err') throw data.err;
        else {
          dispatch(data);
          dispatch(clearError());
          setLoading(false);
          props.history.push('/');
        }
      })
      .catch(e => {
        setLoading(false);
        dispatch(
          returnError(e.response.data.msg, e.response.status, REGISTER_FAIL)
        );
      });
  };
  if (isLoggedIn) {
    return (
      <Message warning style={{ marginTop: '60px ' }}>
        Logout to register
      </Message>
    );
  } else if (isLoggedIn === null) {
    return null;
  } else {
    return (
      <Container className="containerStyle">
        <Form
          loading={loading}
          onSubmit={props.handleSubmit(onFormSubmit)}
          className="formStyle"
        >
          <Header as="h1">Register</Header>
          {error.id === REGISTER_FAIL ? (
            <Message negative>
              <p>{error.msg}</p>
            </Message>
          ) : null}
          <Form.Field>
            <Field
              name="name"
              component={renderInput}
              placeholder="name"
              type="text"
            />
          </Form.Field>
          <Form.Field>
            <Field
              name="email"
              component={renderInput}
              placeholder="email"
              type="email"
            />
          </Form.Field>
          <Form.Field>
            <Field
              name="password"
              component={renderInput}
              placeholder="password"
              type="password"
            />
          </Form.Field>
          <Form.Field>
            <Field
              name="confirm_password"
              component={renderInput}
              placeholder="confirm password"
              type="password"
            />
          </Form.Field>
          <br />
          <Link to="/login" className="authLinkStyle">
            Sign in instead
          </Link>
          <br />
          <button type="submit" className="button">
            Submit
          </button>
        </Form>
      </Container>
    );
  }
};

export default reduxForm({
  form: 'registration form',
  validate
})(Register);
