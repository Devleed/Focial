import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import PostFileField from './PostFileField';

import { createPost } from '../../../helpers';

import Modal from '../Modal';
import { POSTING } from '../../../helpers/actionTypes';
import ModalHead from '../../ModalHead';

const Createpost = props => {
  const [showModal, setShowModal] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const userLoggedIn = useSelector(({ auth }) => auth.user);

  const onCreatePost = () => {
    dispatch({ type: POSTING, payload: true });
    let postContent = {
      postField: value
    };
    postContent.postImageField = files[0];
    dispatch(createPost(postContent));
    setShowModal(false);
    setFiles([]);
    setPreviewImage(null);
    setValue('');
  };
  return (
    <React.Fragment>
      <Modal show={showModal} setShowModal={setShowModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <ModalHead heading="Create Post" cb={setShowModal} />
          <div className="modal-main">
            <div className="user_info">
              <img
                className="small-picture-post"
                src={userLoggedIn.profile_picture}
              />
              <p>{userLoggedIn.name}</p>
            </div>
            <div className="create_info">
              <textarea
                className="create_post-field"
                placeholder="What's on your mind? James"
                rows={previewImage ? '1' : '8'}
                value={value}
                onChange={e => setValue(e.target.value)}
              ></textarea>
              {previewImage ? (
                <div className="image_preview">
                  <button
                    onClick={e => {
                      setFiles([]);
                      setPreviewImage(null);
                    }}
                  >
                    <Icon name="times" />
                  </button>
                  <img src={previewImage} />
                </div>
              ) : null}
              <div className="extra_options">
                <PostFileField
                  files={files}
                  onFileSelect={setFiles}
                  setPreview={setPreviewImage}
                />
                <span>
                  <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/B2DvHIwPOij.png" />
                  <p>Tag People</p>
                </span>
                <span>
                  <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/I9uaowma2QB.png" />
                  <p>Feelings</p>
                </span>
              </div>
            </div>
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
