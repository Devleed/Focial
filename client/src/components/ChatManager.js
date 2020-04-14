import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import ChatListRenderer from './ChatComponents/ChatListRenderer';

/**
 * MAIN COMPONENT
 * - responsible for displaying dropdown for all recent chats
 */
const ChatManager = () => {
  // selecting chats from redux store
  const chats = useSelector(({ messageData }) => messageData.chats);
  return (
    <React.Fragment>
      <Dropdown
        icon="facebook messenger"
        style={{ color: 'white' }}
        floating
        className="icon"
        // onClick={() => {
        //   if (unseen > 0) dispatch(notificationSeen());
        //   unseen = 0;
        // }}
      >
        <Dropdown.Menu
          style={{
            width: '360px',
            paddingBottom: '10px',
            paddingRight: '5px',
            overflowY: 'auto',
            maxHeight: '550px',
          }}
          className="left"
        >
          <Dropdown.Header content="Messages" />
          <ChatListRenderer chats={chats} />
        </Dropdown.Menu>
      </Dropdown>
      {/* {unseen > 0 ? (
        <p className="notification-number number">{unseen}</p>
      ) : null} */}
    </React.Fragment>
  );
};

export default ChatManager;
