import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import FieldFileInput from './PostFileField';

import { createPost } from '../../../helpers';

import Modal from '../Modal';
import { POSTING } from '../../../helpers/actionTypes';

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

const Createpost = props => {
  const [showModal, setShowModal] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

  const onCreatePost = postContent => {
    dispatch({ type: POSTING, payload: true });
    postContent.postImageField = files[0];
    dispatch(createPost(postContent));
    setShowModal(false);
    setFiles([]);
    setPreviewImage(null);
  };
  return (
    <React.Fragment>
      <Modal show={showModal} setShowModal={setShowModal}>
        <div className="modal-content" style={{ width: '41.5%' }}>
          <form
            className="post_form"
            onSubmit={props.handleSubmit(onCreatePost)}
          >
            <div className="head">
              Create Post
              <Icon name="cancel" onClick={() => setShowModal(false)} />
            </div>
            <Field name="postField" component={renderPostField} />
            {previewImage ? (
              <div className="post_image">
                <img src={previewImage} />
              </div>
            ) : null}
            <div className="extra_content">
              <FieldFileInput
                files={files}
                onFileSelect={setFiles}
                setPreview={setPreviewImage}
              />
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
      </Modal>
      <form>
        <span className="post_form-header">Create Post</span>
        <div className="post_field">
          <Icon
            name="user"
            size="huge"
            color="grey"
            style={{ marginTop: '20px' }}
          />
          <textarea
            placeholder="How was your day"
            onClick={() => setShowModal(true)}
          ></textarea>
        </div>
      </form>
    </React.Fragment>
  );
};

const afterSubmit = (result, dispatch) => {
  dispatch(reset('post area'));
};

export default reduxForm({
  form: 'create post form',
  onSubmitSuccess: afterSubmit
})(Createpost);
