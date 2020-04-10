import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createPost } from '../../../helpers';

import Modal from '../Modal';
import ModalHead from '../../ModalHead';
import PostModalContent from './PostModalContent';
import OverlayLoader from '../../OverlayLoader';

const Createpost = props => {
  const [showModal, setShowModal] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();

  const userLoggedIn = useSelector(({ auth }) => auth.user);

  const cleanUp = () => {
    setLoading(false);
    setShowModal(false);
    setFiles([]);
    setPreviewImage(null);
    setValue('');
  };

  const onCreatePost = () => {
    setLoading(true);
    // dispatch({ type: POSTING, payload: true });
    let postContent = {
      postField: value
    };
    postContent.postImageField = files[0];
    dispatch(createPost(postContent, cleanUp));
  };
  return (
    <React.Fragment>
      <Modal show={showModal} setShowModal={setShowModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {loading ? <OverlayLoader /> : null}
          <ModalHead heading="Create Post" cb={setShowModal} />
          <div className="modal-main">
            <div className="user_info">
              <img
                className="small-picture-post"
                src={userLoggedIn.profile_picture}
              />
              <p>{userLoggedIn.name}</p>
            </div>
            <PostModalContent
              previewImage={previewImage}
              value={value}
              setValue={setValue}
              setFiles={setFiles}
              setPreviewImage={setPreviewImage}
              files={files}
              showExtraButtons="true"
            />
          </div>
          <div className="modal-bottom">
            <button onClick={onCreatePost}>Post</button>
          </div>
        </div>
      </Modal>
      <div className="create_post">
        <img src={userLoggedIn.profile_picture} />
        <input
          onClick={() => setShowModal(true)}
          placeholder={`Whats's on your mind? ${userLoggedIn.name}`}
        />
      </div>
    </React.Fragment>
  );
};

export default Createpost;
