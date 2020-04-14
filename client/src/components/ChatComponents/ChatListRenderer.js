import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { stringShortener } from '../../helpers';
import { NavLink } from 'react-router-dom';

/**
 * MAIN COMPONENT
 * - responsible for displaying chat list's JSX
 */
const ChatListRenderer = ({ chats }) => {
  // selecting selected active chat
  const selectedChat = useSelector(({ selectedChat }) => selectedChat);
  // selecting logged in user
  const user = useSelector(({ auth }) => auth.user);

  // sorting chats in descending order by date
  chats.sort((a, b) => b.message.date - a.message.date);

  // function to render chats
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
        <NavLink
          className={`friend-list-item ${unread ? 'unread' : ''}`}
          to={`/chats?user=${chat.user._id}`}
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
        </NavLink>
      );
    });
  };
  return renderChats();
};

export default ChatListRenderer;
