import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import { sharePost } from '../../../helpers';
import Modal from '../Modal';
import ModalHead from '../../ModalHead';
import PostModalContent from './PostModalContent';
import OverlayLoader from '../../OverlayLoader';

/**
 * MAIN COMPONENT
 * - responsible for manage sharing a post
 */
const SharePost = ({ post }) => {
  let image;
  if (post.date_shared) {
    if (post.post.post_image) image = post.post.post_image.url;
  } else if (post.post_image) image = post.post_image.url;
  const [showModal, setShowModal] = useState(null);
  const [previewImage, setPreviewImage] = useState(image);
  const [files, setFiles] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();

  const cleanUp = () => {
    setLoading(false);
    setShowModal(false);
    setFiles([]);
    setPreviewImage(null);
    setValue('');
  };

  const onSharePost = (e) => {
    setLoading(true);
    e.preventDefault();
    dispatch(sharePost(post._id, value, cleanUp));
  };

  return (
    <React.Fragment>
      <Modal show={showModal} setShowModal={setShowModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {loading ? <OverlayLoader /> : null}
          <ModalHead heading="Share Post" cb={setShowModal} />
          <div className="modal-main">
            <PostModalContent
              previewImage={previewImage}
              value={value}
              setValue={setValue}
              setFiles={setFiles}
              setPreviewImage={setPreviewImage}
              files={files}
            />
          </div>
          <div className="modal-bottom">
            <button onClick={onSharePost}>Share</button>
          </div>
        </div>
      </Modal>
      <button className="share_button" onClick={(e) => setShowModal(true)}>
        <Icon name="share" />
        <p>share</p>
      </button>
    </React.Fragment>
  );
};

export default SharePost;
