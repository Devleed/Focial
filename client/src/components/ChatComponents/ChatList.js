import React from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import OverlayLoader from '../OverlayLoader';
import ChatListRenderer from './ChatListRenderer';

/**
 * MAIN COMPONENT
 * - responsible for displaying list of users chatted with
 */
const ChatList = (props) => {
  // selecting all the active chats
  const chats = useSelector(({ messageData }) => messageData.chats);
  // selecting if chats are loading
  const loading = useSelector(({ messageData }) => messageData.chatsLoading);

  return (
    <div className="friend-list">
      <h2>
        Chats <Icon name="plus circle" onClick={() => props.function(true)} />
      </h2>
      {loading ? <OverlayLoader /> : null}
      <ChatListRenderer chats={chats} />
    </div>
  );
};

export default ChatList;
