import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { reduxForm, Field, reset } from 'redux-form';

import PostComments from './PostComments';
import LikePost from './LikePost';
import { commentPost, loadComments } from '../../../helpers';
import { COMMENT_LOADING } from '../../../helpers/actionTypes';

const renderField = ({ input }) => {
  return <input {...input} placeholder="write a comment..." />;
};

const PostActions = props => {
  const [showInput, setShowInput] = useState(false);
  const [commentLoading, setCommentLoading] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const onFormSubmit = commentField => {
    dispatch(commentPost(props.id, commentField[`comment${props.id}`]));
  };

  const loadPostComments = () => {
    setCommentLoading(true);
    setButtonDisabled('disabled');
    setShowInput(true);
    dispatch(loadComments(props.id, setCommentLoading));
  };

  const renderCommentSection = () => {
    if (showInput) {
      return (
        <React.Fragment>
          <div className="post-comments_section">
            <PostComments
              comments={props.comments}
              id={props.id}
              loading={commentLoading}
            />
          </div>
          <form
            className="post_comment-form"
            onSubmit={props.handleSubmit(onFormSubmit)}
          >
            <Icon name="user" size="large" color="grey" />
            <Field name={`comment${props.id}`} component={renderField} />
            <button>
              <Icon name="send" />
            </button>
          </form>
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
          disabled={buttonDisabled}
          className="post_actions-button"
          onClick={loadPostComments}
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
