import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfilePicture } from '../helpers';
import Modal from './HomeComponents/Modal';
import { Icon, Button } from 'semantic-ui-react';

const ProfilePictureUpdater = ({ user }) => {
  const loggedInUser = useSelector(({ auth }) => auth.user);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onChange = e => {
    e.stopPropagation();
    setShowModal(true);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      let reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const cancel = e => {
    e.stopPropagation();
    setPreview(null);
    setFile(null);
    setShowModal(false);
  };

  const afterUpload = () => {
    setPreview(null);
    setFile(null);
    setShowModal(false);
  };

  const onPictureChange = e => {
    e.stopPropagation();
    setLoading(true);
    dispatch(updateProfilePicture(file, afterUpload));
  };

  if (user) {
    if (user._id === loggedInUser._id) {
      return (
        <React.Fragment>
          <Modal show={showModal} setShowModal={setShowModal}>
            <div className="modal-content" style={{ width: '50%' }}>
              <div className="head">
                Update Profile Picture
                <Icon name="cancel" onClick={() => setShowModal(false)} />
              </div>
              <div className="image_upload-content">
                <div className="image-upload">
                  <label
                    htmlFor="file-input"
                    onClick={e => e.stopPropagation()}
                  >
                    <div
                      onClick={e => e.stopPropagation()}
                      className="change_profilepic-btn"
                    >
                      <Icon name="upload" />
                      Upload Picture
                    </div>
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    onChange={onChange}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
                <div>Show The World How Beautiful you are</div>
              </div>
              {preview ? (
                <>
                  <div className="image_preview">
                    <img src={preview} />
                  </div>
                  <div className="bottom">
                    {/* <button onClick={onPictureChange}>Save</button> */}
                    <Button
                      floated="right"
                      loading={loading}
                      onClick={onPictureChange}
                      primary
                    >
                      save
                    </Button>
                    <Button floated="right" negative onClick={cancel}>
                      cancel
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </Modal>
          <img
            src={`${
              user.profile_picture
                ? user.profile_picture
                : 'https://homepages.cae.wisc.edu/~ece533/images/watch.png'
            }`}
            alt="profile photo"
            className="profile_photo"
            onClick={() => setShowModal(true)}
          />
        </React.Fragment>
      );
    } else {
      return (
        <img
          src={`${
            user.profile_picture
              ? user.profile_picture
              : 'https://homepages.cae.wisc.edu/~ece533/images/watch.png'
          }`}
          alt="profile photo"
          className="profile_photo"
        />
      );
    }
  }
};

export default ProfilePictureUpdater;
