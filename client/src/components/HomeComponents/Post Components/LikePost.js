import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import { likePost, unlikePost } from '../../../helpers';
import { UPDATE_STATS } from '../../../helpers/actionTypes';

const LikePost = props => {
  const userLoggedIn = useSelector(({ auth }) => auth.user._id);
  const [activeButton, setActiveButton] = useState(null);

  const dispatch = useDispatch();

  const unlikeThisPost = () => {
    setActiveButton(false);
    dispatch(unlikePost(props.id));
    dispatch({
      type: UPDATE_STATS,
      payload: { id: props.id, stats: { likes: --props.likes.length } }
    });
  };
  const likeThisPost = () => {
    let createNotification = userLoggedIn !== props.author;
    setActiveButton(true);
    dispatch(likePost(props.id, createNotification));
    dispatch({
      type: UPDATE_STATS,
      payload: { id: props.id, stats: { likes: ++props.likes.length } }
    });
  };

  return (
    <button
      className={`post_actions-button ${
        props.likes.includes(userLoggedIn) || activeButton
          ? 'post_actions-button-active'
          : ''
      }`}
      onClick={
        props.likes.includes(userLoggedIn) ? unlikeThisPost : likeThisPost
      }
    >
      <Icon name="thumbs up outline" />
      Like
    </button>
  );
};

export default LikePost;
