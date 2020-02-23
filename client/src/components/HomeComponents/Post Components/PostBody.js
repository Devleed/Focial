import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { editPost } from '../../../helpers';

const renderInput = ({ input, placeholder }) => {
  return <textarea {...input} value={placeholder} autoFocus />;
};

const PostBody = props => {
  const [initialValue, setInitialValue] = useState(props.body);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFormSubmit = values => {
    setLoading(true);
    dispatch(
      editPost(
        props.id,
        values[`postBody${props.id}`],
        props.setEditing,
        setLoading
      )
    );
  };

  return (
    <div
      className={`post_content ${
        props.body.length > 100 ? 'post_content-long' : ''
      }`}
    >
      {props.editing ? (
        <form onSubmit={props.handleSubmit(onFormSubmit)}>
          <Icon
            name="cancel"
            style={{ float: 'right' }}
            size="small"
            onClick={() => props.setEditing(false)}
          />
          <Field
            name={`postBody${props.id}`}
            placeholder={initialValue}
            onChange={e => setInitialValue(e.target.value)}
            component={renderInput}
          />
          <Button loading={loading} primary type="submit">
            Save
          </Button>
        </form>
      ) : (
        props.body
      )}
    </div>
  );
};

export default reduxForm({ form: 'post edit form' })(PostBody);
