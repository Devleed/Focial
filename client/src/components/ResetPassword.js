import React, { useState, useEffect } from 'react';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  Button,
  Header,
  Message,
  Loader,
  Container,
} from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import { resetPassword, clearError, resetPasswordViaEmail } from '../helpers';

// function to render input fields
const renderInput = ({
  input,
  type,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <div>
      <input {...input} type={type} placeholder={placeholder} />
      {touched && error && (
        <Message negative className="negative_message-style">
          {error}
        </Message>
      )}
    </div>
  );
};

// function to validate input fields
const validate = (values) => {
  let errors = {};
  if (!values.password) errors.password = 'Enter password';
  else if (values.password !== values.confirm_password)
    errors.confirm_password = "Passwords don't match";
  else if (values.password.length < 5)
    errors.password = 'password should be of 5 character';
  return errors;
};

/**
 * MAIN COMPONENT
 * - responsible for displaying and managing reset password form
 */
const ResetPassword = (props) => {
  const dispatch = useDispatch();
  // using state to manage message
  const [msg, setMsg] = useState('');
  // using state to manage email
  const [email, setEmail] = useState(null);
  // using state to manage loading state
  const [loading, setLoading] = useState(false);

  // on mount
  useEffect(() => {
    (() => {
      resetPassword(props.match.params.token)
        .then((data) => {
          if (data.type === 'err') throw data.err;
          else {
            setMsg(data.msg);
            setEmail(data.email);
          }
        })
        .catch((e) => setMsg(e.response.data.msg));
    })();
  }, [props.match.params.token]);

  // function to perform when for is submitted
  const onFormSubmit = (values) => {
    setLoading(true);
    resetPasswordViaEmail({ email, password: values.password })
      .then((data) => {
        if (data.type === 'err') throw data.err;
        else {
          dispatch(clearError());
          setLoading(false);
          props.history.push('/login');
        }
      })
      .catch((e) => {
        setLoading(false);
        setMsg(e.response.data.msg);
      });
  };
  const display = () => {
    // if loading return loader
    if (loading) {
      return <Loader active />;
    }
    if (msg === 'Token is invalid or expired') {
      return (
        <Message style={{ marginTop: '60px' }} negative>
          {msg}
        </Message>
      );
    } else if (msg === 'Token is valid') {
      return (
        <Form
          loading={loading}
          className="formStyle"
          onSubmit={props.handleSubmit(onFormSubmit)}
        >
          <Header as="h1">Reset Password</Header>
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
          <Button type="submit">Submit</Button>
        </Form>
      );
    } else return null;
  };

  return <Container className="containerStyle">{display()}</Container>;
};

// powered by redux forms
export default reduxForm({
  form: 'reset password form',
  validate,
})(ResetPassword);
