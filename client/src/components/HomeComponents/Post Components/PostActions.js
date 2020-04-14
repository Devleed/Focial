import React, { useState, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxForm, reset } from 'redux-form';

import PostComments from './PostComments';
import LikePost from './LikePost';
import { commentPost, loadComments } from '../../../helpers';
import SharePost from './SharePost';
import { UPDATE_STATS } from '../../../helpers/actionTypes';
import ControlledTextarea from '../../ControlledTextarea';

/**
 * MAIN COMPONENT
 * - responsible for manage post actions
 */
const PostActions = ({ post, commentSection }) => {
  const user = useSelector(({ auth }) => auth.user);
  const [showInput, setShowInput] = useState(false);
  const [commentLoading, setCommentLoading] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const onFormSubmit = (e) => {
    e.preventDefault();
    dispatch(commentPost(post._id, value));
    dispatch({
      type: UPDATE_STATS,
      payload: { id: post._id, stats: { comments: ++post.stats.comments } },
    });
    setValue('');
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
          <div className="comment_section">
            <PostComments
              comments={post.comments}
              loading={commentLoading}
              stats={post.stats.comments}
            />
          </div>
          <div className="comment_form">
            <form onSubmit={(e) => onFormSubmit(e)}>
              <div className="comment_field">
                <img className="small-img" src={user.profile_picture} />
                <div>
                  <ControlledTextarea
                    value={value}
                    setValue={setValue}
                    submit={onFormSubmit}
                    placeholder="write a comment..."
                  />
                  <Icon name="globe" />
                  <Icon name="camera retro" />
                  <Icon name="image outline" />
                </div>
              </div>
            </form>
          </div>
        </React.Fragment>
      );
    }
    return null;
  };
  return (
    <React.Fragment>
      <div className="post_action">
        <LikePost likes={post.likes} id={post._id} author={post.author._id} />
        <button
          className="comment_button"
          disabled={buttonDisabled}
          onClick={loadPostComments}
        >
          <Icon name="comment outline" />
          <p>comment</p>
        </button>
        <SharePost post={post} />
      </div>
      {renderCommentSection()}
    </React.Fragment>
  );
};

const afterSubmit = (result, dispatch) => {
  dispatch(reset('comment form'));
};

export default reduxForm({
  form: 'comment form',
  onSubmitSuccess: afterSubmit,
})(PostActions);
