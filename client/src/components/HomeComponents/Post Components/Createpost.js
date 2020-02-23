import React, { useState, useRef, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../../helpers';

import Modal from '../Modal';

const Createpost = () => {
  const [showModal, setShowModal] = useState(null);
  const [addClass, setAddClass] = useState('');
  const [showLoader, setShowLoader] = useState(true);
  const dispatch = useDispatch();

  const onCreatePost = postContent => {
    setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    dispatch(createPost(postContent));
    setShowModal(false);
    setAddClass('post_loader-loaded');
  };
  return (
    <React.Fragment>
      <Modal
        show={showModal}
        setShowModal={setShowModal}
        onCreatePost={onCreatePost}
      />
      <form>
        <span className="post_form-header">Create Post</span>
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
        {showLoader ? (
          <span className={`post_loader ${addClass}`}></span>
        ) : null}
      </form>
    </React.Fragment>
  );
};

export default Createpost;
