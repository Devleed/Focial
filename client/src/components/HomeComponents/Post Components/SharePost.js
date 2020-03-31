import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { sharePost } from '../../../helpers';
import PostBody from './PostBody';
import Modal from '../Modal';
import { SHARING, UPDATE_STATS } from '../../../helpers/actionTypes';

const SharePost = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const onSharePost = e => {
    e.preventDefault();
    dispatch({ type: SHARING, payload: true });
    dispatch(sharePost(post._id, value));
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <button className="share_button" onClick={onSharePost}>
        <Icon name="share" />
        <p>share</p>
      </button>
    </React.Fragment>
  );
};

export default SharePost;
