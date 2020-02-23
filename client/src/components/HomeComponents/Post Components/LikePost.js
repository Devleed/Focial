import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import { likePost, unlikePost } from '../../../helpers';

const LikePost = props => {
  const userLoggedIn = useSelector(({ auth }) => auth.user._id);
  const [activeButton, setActiveButton] = useState(null);

  const dispatch = useDispatch();

  const unlikeThisPost = () => {
    setActiveButton(false);
    dispatch(unlikePost(props.id));
  };
  const likeThisPost = () => {
    setActiveButton(true);
    dispatch(likePost(props.id));
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
