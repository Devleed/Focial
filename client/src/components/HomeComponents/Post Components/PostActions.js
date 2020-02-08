import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { reduxForm, Field, reset } from 'redux-form';

import PostComments from './PostComments';
import LikePost from './LikePost';
import { commentPost } from '../../../helpers';

const renderField = ({ input }) => {
  return <input autoFocus {...input} placeholder="write a comment..." />;
};

const PostActions = props => {
  const [showInput, setShowInput] = useState(false);
  const dispatch = useDispatch();

  const onFormSubmit = ({ commentField }) => {
    dispatch(commentPost(props.id, commentField));
  };

  const renderCommentSection = () => {
    if (showInput) {
      return (
        <React.Fragment>
          <form
            className="post_comment-form"
            onSubmit={props.handleSubmit(onFormSubmit)}
          >
            <Icon name="user" size="large" color="grey" />
            <Field name="commentField" component={renderField} />
            <button>
              <Icon name="send" />
            </button>
          </form>
          <div className="post-comments_section">
            <PostComments comments={props.comments} id={props.id} />
          </div>
        </React.Fragment>
      );
    }
    return null;
  };
  return (
    <React.Fragment>
      <div className="post_actions">
        <LikePost likes={props.likes} id={props.id} />
        <button
          className="post_actions-button"
          onClick={() => setShowInput(true)}
        >
          <Icon name="comment outline" />
          Comment
        </button>
        <button className="post_actions-button">
          <Icon name="share" />
          Share
        </button>
      </div>
      <div className="post_comment-section">{renderCommentSection()}</div>
    </React.Fragment>
  );
};

const afterSubmit = (result, dispatch) => {
  dispatch(reset('comment form'));
};

export default reduxForm({
  form: 'comment form',
  onSubmitSuccess: afterSubmit
})(PostActions);
