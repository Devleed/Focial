import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { sharePost } from '../../../helpers';
import PostHead from './PostHead';

import Modal from '../Modal';
import { SHARING, UPDATE_STATS } from '../../../helpers/actionTypes';

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
        placeholder="About the post"
        autoFocus
      ></textarea>
    </div>
  );
};

const SharePost = props => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  // const onSharePost = values => {
  //   console.log(values);
  //   dispatch(sharePost(props.id, values[`sharePostField${props.id}`]));
  // };

  return (
    <React.Fragment>
      {/* <Modal show={showModal} setShowModal={setShowModal}>
        <div className="modal-content" style={{ width: '41.5%' }}>
          <form
            className="post_form"
            onSubmit={props.handleSubmit(onSharePost)}
          >
            <div className="head">
              Share Post
              <Icon name="cancel" onClick={() => setShowModal(false)} />
            </div>
            <Field
              name={`sharePostField${props.id}`}
              component={renderPostField}
            />
            {props.image ? (
              <div className="post_image">
                <img src={props.image.url} />
              </div>
            ) : (
              <div className="post_share-info">
                <PostHead
                  author={props.author}
                  author_name={props.author_name}
                  date={props.date_created}
                />
                <div
                  className={`post_content ${
                    props.image ? 'post_content-long' : null
                  }`}
                >
                  {props.body}
                </div>
              </div>
            )}
            <button
              type="submit"
              type="button"
              className="post_button"
              onClick={e => {
                setShowModal(false);
                e.stopPropagation();
              }}
            >
              Share
            </button>
          </form>
        </div>
      </Modal> */}
      <button
        className="post_actions-button"
        onClick={() => {
          dispatch({ type: SHARING, payload: true });
          dispatch(sharePost(props.id, ''));
        }}
      >
        <Icon name="share" />
        Share
      </button>
    </React.Fragment>
  );
};

export default reduxForm({ form: 'share form' })(SharePost);
