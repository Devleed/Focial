import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

// import PostFileField from '../HomeComponents/Post Components/PostFileField';
import ControlledTextarea from '../ControlledTextarea';
import { PRIVATE_MESSAGE } from '../../helpers/socketTypes';
import { CREATE_MESSAGE } from '../../helpers/actionTypes';

/**
 * MAIN COMPONENT
 * - responsible for creation of a message
 */
const CreateMessage = () => {
  // using state to manage value
  const [value, setValue] = useState('');
  // const [files, setFiles] = useState([]);
  // using state to manage preview
  const [previewImage, setPreviewImage] = useState(null);
  // selecting user chatting with
  const chatUser = useSelector(
    ({ messageData }) => messageData.selectedChat.user
  );
  // selectnig saved socket
  const socket = useSelector(({ auth }) => auth.socket);
  const dispatch = useDispatch();

  // calback for message sent
  const messageSent = (message) => {
    dispatch({ type: CREATE_MESSAGE, payload: message });
  };

  // on message sent
  const onFormSubmit = (e) => {
    socket.emit(
      PRIVATE_MESSAGE,
      { reciever: chatUser._id, body: value },
      messageSent
    );
    setValue('');
  };

  return (
    <React.Fragment>
      <div className="create-message">
        {/* <PostFileField
          files={files}
          onFileSelect={setFiles}
          setPreview={setPreviewImage}
        >
          <Icon name="image" />
        </PostFileField> */}
        {/* <Icon name="gift" /> */}
        <Icon name="plus circle" />
        <ControlledTextarea
          value={value}
          setValue={setValue}
          submit={onFormSubmit}
          placeholder="Write a message..."
        />
        <Icon name="send" onClick={onFormSubmit} />
      </div>
      {previewImage ? (
        <div className="message_image-preview">
          <div>
            <img src={previewImage} alt="message sending image" />
            <button>X</button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default CreateMessage;
