import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import MessageList from './MessageList';
import { NavLink } from 'react-router-dom';

/**
 * MAIN COMPONENT
 * - responsible for displaying chat box
 */
const ChatBox = (props) => {
  // selecting which user person is chatting with
  const chatUser = useSelector(
    ({ messageData }) => messageData.selectedChat.user
  );

  if (props.showChatBox) {
    return (
      <MessageList className="chat_box" id={props.selectedChat}>
        <div className="chat_box-info">
          {chatUser ? (
            <React.Fragment>
              <img src={chatUser.profile_picture} />
              <NavLink to={`/user/${chatUser._id}`}>{chatUser.name}</NavLink>
            </React.Fragment>
          ) : null}
          <Icon name="cancel" onClick={() => props.setShowChatBox(false)} />
        </div>
      </MessageList>
    );
  } else return null;
};

export default ChatBox;
