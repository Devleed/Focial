import React, { useState } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form, Message, Button, Container } from 'semantic-ui-react';

import { sendResetEmail } from '../helpers';

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
  if (!values.email) errors.email = 'Enter email';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    errors.email = 'Invalid email';
  return errors;
};

/**
 * MAIN COMPONENT
 * - responsible for getting user's email and performing actions
 */
const ResetPasswordParent = (props) => {
  // using state to manage message
  const [msg, setMsg] = useState({ type: null, text: null });
  // using state to manage loading state
  const [loading, setLoading] = useState(false);
  // function to perform when form is submitted
  const onFormSubmit = (values) => {
    setLoading(true);
    sendResetEmail(values.email)
      .then((data) => {
        setMsg({ type: 'positive', text: data.msg });
        setLoading(false);
      })
      .catch((e) => {
        setMsg({ type: 'negative', text: e.response.data.msg });
        setLoading(false);
      });
  };
  return (
    <Container className="containerStyle">
      <Form
        loading={loading}
        className="formStyle"
        onSubmit={props.handleSubmit(onFormSubmit)}
      >
        {msg.type && msg.text ? (
          <Message className="positive_message-style" {...{ [msg.type]: true }}>
            {msg.text}
          </Message>
        ) : null}
        <Form.Field>
          <Field
            name="email"
            component={renderInput}
            placeholder="Enter your email"
          />
        </Form.Field>
        <Button type="submit">Send</Button>
      </Form>
    </Container>
  );
};

export default reduxForm({
  form: 'send email form',
  validate,
})(ResetPasswordParent);
