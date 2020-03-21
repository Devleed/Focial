import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxForm, Field, reset } from 'redux-form';

import PostComments from './PostComments';
import LikePost from './LikePost';
import { commentPost, loadComments } from '../../../helpers';
import SharePost from './SharePost';
import { UPDATE_STATS } from '../../../helpers/actionTypes';

const renderField = ({ input }) => {
  return <input {...input} placeholder="write a comment..." />;
};

const PostActions = ({ post, handleSubmit, commentSection }) => {
  const user = useSelector(({ auth }) => auth.user);
  const [showInput, setShowInput] = useState(false);
  const [commentLoading, setCommentLoading] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const onFormSubmit = commentField => {
    dispatch(commentPost(post._id, commentField[`comment${post._id}`]));
    dispatch({
      type: UPDATE_STATS,
      payload: { id: post._id, stats: { comments: ++post.stats.comments } }
    });
  };

  const loadPostComments = () => {
    setCommentLoading(true);
    setButtonDisabled('disabled');
    setShowInput(true);
    dispatch(loadComments(post._id, setCommentLoading));
  };

  if (commentSection && !showInput) {
    loadPostComments();
  }

  const renderCommentSection = () => {
    if (showInput) {
      return (
        <React.Fragment>
          <div className="post-comments_section">
            <PostComments
              comments={post.comments}
              id={post._id}
              loading={commentLoading}
              stats={post.stats.comments}
            />
          </div>
          <form
            className="post_comment-form"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            {user.profile_picture ? (
              <div className="post_author-dp">
                <img src={user.profile_picture} />
              </div>
            ) : (
              <Icon name="user" size="large" color="grey" />
            )}
            <Field name={`comment${post._id}`} component={renderField} />
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
        <LikePost
          likes={post.likes}
          author={post.share_author ? post.share_author._id : post.author._id}
          id={post._id}
        />
        <button
          disabled={buttonDisabled}
          className="post_actions-button"
          onClick={loadPostComments}
        >
          <Icon name="comment outline" />
          Comment
        </button>
        <SharePost
          image={post.post_image}
          id={post._id}
          author={post.author}
          date_created={post.date_created}
          body={post.body}
          shares={post.stats.shares}
        />
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
