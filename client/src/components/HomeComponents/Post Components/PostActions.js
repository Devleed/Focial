import React, { useState, useRef } from 'react';
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

const PostActions = ({ post, handleSubmit, commentSection, renderBody }) => {
  const user = useSelector(({ auth }) => auth.user);
  const [showInput, setShowInput] = useState(false);
  const [commentLoading, setCommentLoading] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [value, setValue] = useState('');
  const [scrollHeight, setScrollHeight] = useState(34);
  let [rows, setRows] = useState(1);
  const textRef = useRef(null);
  const dispatch = useDispatch();

  const onFormSubmit = e => {
    e.preventDefault();
    dispatch(commentPost(post._id, value));
    dispatch({
      type: UPDATE_STATS,
      payload: { id: post._id, stats: { comments: ++post.stats.comments } }
    });
    setValue('');
    setRows(1);
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
            <form onSubmit={e => onFormSubmit(e)}>
              <div className="comment_field">
                <img className="small-img" src={user.profile_picture} />
                <div>
                  <textarea
                    ref={textRef}
                    value={value}
                    onChange={e => {
                      setValue(e.target.value);
                      if (scrollHeight < textRef.current.scrollHeight) {
                        setScrollHeight(textRef.current.scrollHeight);
                        setRows(++rows);
                      }
                      if (e.target.value === '') setRows(1);
                    }}
                    onKeyDown={e => {
                      if (e.keyCode === 13 && e.shiftKey === false) {
                        e.preventDefault();
                        onFormSubmit(e);
                      }
                    }}
                    rows={rows}
                    placeholder="Write a comment..."
                  ></textarea>
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
  onSubmitSuccess: afterSubmit
})(PostActions);
