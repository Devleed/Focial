import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown, Icon } from 'semantic-ui-react';
import Modal from '../Modal';
import ModalMessage from '../../ModalMessage';
import { deletePost } from '../../../helpers';
import { DELETING } from '../../../helpers/actionTypes';

/**
 * MAIN COMPONENT
 * - responsible for manage deleting a post
 */
const DeletePost = ({ post }) => {
  const [showModal, setShowModal] = useState(null);
  const dispatch = useDispatch();

  const onDeletePost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: DELETING, payload: true });
    dispatch(
      deletePost(post._id, post.post_image ? post.post_image.public_id : 'none')
    );
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <Modal show={showModal} setShowModal={setShowModal}>
        <ModalMessage
          heading="Delete Post"
          cb={setShowModal}
          message="Are you sure you want to delete this post?"
          buttonText="Delete"
          buttonFunction={onDeletePost}
        />
      </Modal>
      <Dropdown.Item
        onClick={() => {
          setShowModal(true);
        }}
      >
        <Icon name="delete" />
        Delete
      </Dropdown.Item>
    </React.Fragment>
  );
};

export default DeletePost;
