import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostFileField from './HomeComponents/Post Components/PostFileField';

import { updateProfilePicture } from '../helpers';
import Modal from './HomeComponents/Modal';
import ModalHead from './ModalHead';
import { Icon } from 'semantic-ui-react';

/**
 * MAIN COMPONENT
 * - responsible for profile picture update management
 */
const ProfilePictureUpdater = ({ user }) => {
  // select logged in user
  const loggedInUser = useSelector(({ auth }) => auth.user);
  // using state to manage image preview
  const [preview, setPreview] = useState(null);
  // using state to manage modal display
  const [showModal, setShowModal] = useState(null);
  // using state to manage files
  const [file, setFile] = useState([]);
  const dispatch = useDispatch();

  // funtion to perform after uploading
  const afterUpload = () => {
    setPreview(null);
    setFile(null);
    setShowModal(false);
  };

  // function to perform when picture is changed
  const onPictureChange = (e) => {
    e.stopPropagation();
    dispatch(updateProfilePicture(file[0], afterUpload));
  };

  if (user) {
    if (user._id === loggedInUser._id) {
      return (
        <React.Fragment>
          <Modal show={showModal} setShowModal={setShowModal}>
            <div className="modal-content">
              <ModalHead heading="Update" cb={setShowModal} />
              <div className="image_upload-content">
                <PostFileField
                  files={file}
                  onFileSelect={setFile}
                  setPreview={setPreview}
                >
                  <Icon name="upload" />
                </PostFileField>
                <div>Show The World How Beautiful you are</div>
              </div>
              {preview ? (
                <React.Fragment>
                  <img src={preview} className="image_preview" />
                  <div className="modal-bottom">
                    <button onClick={onPictureChange}>Update</button>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          </Modal>
          <img
            src={user.profile_picture}
            alt="profile photo"
            className="profile_photo"
            onClick={() => setShowModal(true)}
          />
        </React.Fragment>
      );
    } else {
      return (
        <img
          src={user.profile_picture}
          alt="profile photo"
          className="profile_photo"
        />
      );
    }
  }
};

export default ProfilePictureUpdater;
