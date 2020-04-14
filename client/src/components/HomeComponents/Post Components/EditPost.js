import React, { useState } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import Modal from '../Modal';
import ModalHead from '../../ModalHead';
import PostModalContent from './PostModalContent';
import { editPost } from '../../../helpers';
import OverlayLoader from '../../OverlayLoader';

/**
 * MAIN COMPONENT
 * - responsible for manage editing a post
 */
const EditPost = ({ post }) => {
  let image;
  if (post.date_shared) {
    if (post.post.post_image) image = post.post.post_image.url;
  } else if (post.post_image) image = post.post_image.url;
  const body = post.body;
  const [showModal, setShowModal] = useState(null);
  const [previewImage, setPreviewImage] = useState(image);
  const [files, setFiles] = useState([]);
  const [value, setValue] = useState(body);
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();

  const cleanUp = () => {
    setLoading(false);
    setShowModal(false);
    setFiles([]);
    setPreviewImage(null);
    setValue('');
  };

  const onEditPost = (e) => {
    e.stopPropagation();
    dispatch(editPost(post._id, value, cleanUp));
  };

  return (
    <React.Fragment>
      <Modal show={showModal} setShowModal={setShowModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {loading ? <OverlayLoader /> : null}
          <ModalHead heading="Edit Post" cb={setShowModal} />
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
            <button onClick={onEditPost}>Edit</button>
          </div>
        </div>
      </Modal>
      <Dropdown.Item onClick={() => setShowModal(true)}>
        <Icon name="edit" />
        Edit
      </Dropdown.Item>
    </React.Fragment>
  );
};

export default EditPost;
