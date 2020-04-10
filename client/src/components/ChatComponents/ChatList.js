import React from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import moment from 'moment';

import { stringShortener } from '../../helpers';
import OverlayLoader from '../OverlayLoader';

const ChatList = (props) => {
  const chats = useSelector(({ messageData }) => messageData.chats);
  const loading = useSelector(({ messageData }) => messageData.chatsLoading);
  const user = useSelector(({ auth }) => auth.user);
  const selectedChat = useSelector(
    ({ messageData }) => messageData.selectedChat.user
  );

  chats.sort((a, b) => b.message.date - a.message.date);

  const renderChats = () => {
    return chats.map((chat) => {
      let unread;
      if (chat.message.sentBy !== user._id && chat.message.status === 0) {
        unread = true;
        if (selectedChat) {
          if (selectedChat._id === chat.user._id) {
            unread = false;
          }
        }
      }
      return (
        <li
          className={`friend-list-item ${unread ? 'unread' : ''}`}
          onClick={() => props.history.push(`/chats?user=${chat.user._id}`)}
          key={chat.user._id}
        >
          <img src={chat.user.profile_picture} />
          <div>
            <span>{chat.user.name}</span>
            <br />
            <span className="last_message">{`${
              chat.message.sentBy === user._id ? 'You: ' : ''
            }${stringShortener(chat.message.body, 50)}`}</span>
          </div>
          <div className="chat_list-info">
            {unread ? <span className="unread-indicator" /> : null}
            <span className="last_message-date">
              {moment(chat.message.date).format('LT')}
            </span>
          </div>
        </li>
      );
    });
  };

  return (
    <div className="friend-list">
      <h2>
        Chats <Icon name="plus circle" onClick={() => props.function(true)} />
      </h2>
      {loading ? <OverlayLoader /> : null}
      {renderChats()}
    </div>
  );
};

export default ChatList;
