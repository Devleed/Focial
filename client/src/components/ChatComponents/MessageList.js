import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import moment from 'moment';

import OverlayLoader from '../OverlayLoader';
import CreateMessage from './CreateMessage';
import { getMessages } from '../../helpers';

const MessageList = (props) => {
  const chat = useSelector(({ messageData }) => messageData.selectedChat);
  const user = useSelector(({ auth }) => auth.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.id) {
      console.log(props.id);
      setLoading(true);
      dispatch(getMessages(props.id, setLoading));
    }
  }, [props.id, dispatch]);

  const renderMessages = (messages) => {
    return messages.map((message, i) => {
      if (message.sentBy === user._id) {
        return (
          <div className="own-msg" key={i}>
            <Icon name="ellipsis horizontal" />
            <span>{moment(message.date).format('LT')}</span>
            <div>{message.body}</div>
            <img src={user.profile_picture} />
          </div>
        );
      } else {
        return (
          <div className="friend-msg" key={i}>
            <img src={chat.user.profile_picture} />
            <div>{message.body}</div>
            <span>{moment(message.date).format('LT')}</span>
            <Icon name="ellipsis horizontal" />
          </div>
        );
      }
    });
  };

  const renderMessagesByDate = () => {
    return chat.messagesByDate.map((message, i) => {
      message.messages.sort((a, b) => b.date - a.date);
      return (
        <React.Fragment key={i}>
          <div className="real-messages">
            {renderMessages(message.messages)}
          </div>
          <div className="message-date">
            <span>{moment(message.date).format('MMM Do YY')}</span>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="messages-div">
      {props.id ? (
        <React.Fragment>
          <h2>Messages</h2>
          <div className="message-list">
            {loading ? <OverlayLoader /> : null}
            {renderMessagesByDate()}
          </div>
          <CreateMessage />
        </React.Fragment>
      ) : (
        <h1>
          Select a chat
          <br /> to view conversation
        </h1>
      )}
    </div>
  );
};

export default MessageList;
