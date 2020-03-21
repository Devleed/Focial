import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { editPost } from '../../../helpers';
import Modal from '../Modal';

const renderInput = ({ input, placeholder }) => {
  return <textarea {...input} value={placeholder} autoFocus />;
};

const PostBody = props => {
  const [initialValue, setInitialValue] = useState(props.body);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(null);
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

  const editForm = () => {
    return (
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
    );
  };

  const renderBody = text => {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((t, index) => {
      if (!t.match(urlRegex)) return t;
      return (
        <a key={index} href={t} target="_blank" style={{ color: '#008ecc' }}>
          {t}
        </a>
      );
    });
  };

  console.log(renderBody(props.body));

  const displayBody = () => {
    if (props.image) {
      return (
        <React.Fragment>
          <Modal show={showModal} setShowModal={setShowModal}>
            <div
              className="modal-content image_modal"
              style={{
                width: `${props.image.width / 1.3}px`,
                height: `${props.image.height / 1.3}px`
              }}
            >
              <img src={props.image.url} className="post_image-modal" />
              <Icon name="options" className="options_icon" />
            </div>
          </Modal>
          <div className="post_content-image">
            {props.editing ? (
              <div className="post_content">{editForm()}</div>
            ) : (
              <div className="post_image-info">{props.body}</div>
            )}
            <img
              src={props.image.url}
              className="post_image"
              onClick={() => setShowModal(true)}
            />
          </div>
        </React.Fragment>
      );
    } else
      return (
        <div
          className={`post_content ${
            props.body.length > 100 || props.shared ? 'post_content-long' : ''
          }`}
        >
          {props.editing ? editForm() : renderBody(props.body)}
        </div>
      );
  };

  return displayBody();
};

export default reduxForm({ form: 'post edit form' })(PostBody);
