import React from "react";
import { reduxForm, Field } from "redux-form";
import { Form, Button, Header } from "semantic-ui-react";
import { useDispatch } from "react-redux";

import { registerUser, clearError } from "../helpers";

const renderInput = ({ input, type, label }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} type={type} />
    </div>
  );
};

const Register = props => {
  const dispatch = useDispatch();
  const onFormSubmit = values => {
    if (values.password !== values.confirm_password) {
      alert("password does not match");
      return false;
    }
    registerUser(values)
      .then(data => {
        data.forEach(elem => dispatch(elem));
        clearError();
        props.history.push("/");
      })
      .catch(e => console.log(e));
  };
  return (
    <Form onSubmit={props.handleSubmit(onFormSubmit)}>
      <Header as="h1">Register</Header>
      <Form.Field>
        <Field name="name" component={renderInput} label="name" type="text" />
      </Form.Field>
      <Form.Field>
        <Field
          name="email"
          component={renderInput}
          label="email"
          type="email"
        />
      </Form.Field>
      <Form.Field>
        <Field
          name="password"
          component={renderInput}
          label="password"
          type="password"
        />
      </Form.Field>
      <Form.Field>
        <Field
          name="confirm_password"
          component={renderInput}
          label="confirm password"
          type="password"
        />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default reduxForm({
  form: "registration form"
})(Register);
