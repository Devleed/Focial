import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../../helpers';

import Modal from '../Modal';

const Createpost = () => {
  const [showModal, setShowModal] = useState(null);
  const dispatch = useDispatch();

  const onCreatePost = value => {
    dispatch(createPost(value));
    setShowModal(false);
  };
  return (
    <React.Fragment>
      <Modal
        show={showModal}
        setShowModal={setShowModal}
        onCreatePost={onCreatePost}
      />
      <form>
        <span>Create Post</span>
        <div className="post_field">
          <Icon
            name="user"
            size="huge"
            color="grey"
            style={{ marginTop: '20px' }}
          />
          <textarea
            placeholder="How was your day"
            onClick={() => setShowModal(true)}
          ></textarea>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Createpost;
