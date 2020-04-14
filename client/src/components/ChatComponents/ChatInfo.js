import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

/**
 * MAIN COMPONENT
 * - responsible for displayin chat user's info
 */
const ChatInfo = () => {
  // selecting which user person is chatting with
  const chatUser = useSelector(
    ({ messageData }) => messageData.selectedChat.user
  );

  if (chatUser) {
    return (
      <div className="friend-info">
        <h2>User</h2>
        <img src={chatUser.profile_picture} />
        <div>
          <NavLink to={`/user/${chatUser._id}`}>{chatUser.name}</NavLink>
          <br />
          <span>Joined in {chatUser.register_date.split('-')[0]}</span>
        </div>
      </div>
    );
  } else return null;
};

export default ChatInfo;
