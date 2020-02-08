import React from 'react';
import reactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import { Icon } from 'semantic-ui-react';
import '../../styles/modal.css';

const renderPostField = ({ input }) => {
  return (
    <div className="post_field">
      <Icon
        name="user"
        size="huge"
        color="grey"
        style={{ marginTop: '20px' }}
      />
      <textarea
        {...input}
        onClick={e => e.stopPropagation()}
        placeholder="How was your day"
        autoFocus
      ></textarea>
    </div>
  );
};

const Modal = props => {
  if (!props.show) {
    return null;
  }
  const onFormSubmit = ({ postField }) => {
    props.onCreatePost(postField);
  };
  return reactDOM.createPortal(
    <div className="modal" onClick={() => props.setShowModal(false)}>
      <div className="modal-content">
        <form className="post_form" onSubmit={props.handleSubmit(onFormSubmit)}>
          <div className="head">
            Create Post
            <Icon name="cancel" onClick={() => props.setShowModal(false)} />
          </div>
          <Field name="postField" component={renderPostField} />
          <div className="extra_content">
            <button>
              <Icon name="image" />
              Upload Photo
            </button>
            <button>
              <Icon name="file alternate" />
              Upload File
            </button>
            <button onClick={e => e.stopPropagation()}>
              <Icon name="video" />
              Upload some thing else
            </button>
          </div>
          <button
            type="submit"
            className="post_button"
            onClick={e => e.stopPropagation()}
          >
            Post
          </button>
        </form>
      </div>
    </div>,
    document.getElementById('modal')
  );
};

export default reduxForm({ form: 'post area' })(Modal);
