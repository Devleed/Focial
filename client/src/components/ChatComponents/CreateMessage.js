import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import ControlledTextarea from '../ControlledTextarea';
import { PRIVATE_MESSAGE } from '../../helpers/socketTypes';
import { CREATE_MESSAGE } from '../../helpers/actionTypes';

const CreateMessage = () => {
  const [value, setValue] = useState('');
  const chatUser = useSelector(
    ({ messageData }) => messageData.selectedChat.user
  );
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
    <div className="create-message">
      <Icon name="image" />
      <Icon name="gift" />
      <Icon name="plus circle" />
      <ControlledTextarea
        value={value}
        setValue={setValue}
        submit={onFormSubmit}
        placeholder="Write a message..."
      />
      <Icon name="send" onClick={onFormSubmit} />
    </div>
  );
};

export default CreateMessage;
