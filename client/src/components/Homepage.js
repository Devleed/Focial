import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Rightsidebar from './HomeComponents/Rightsidebar';
import Navbar from './Navbar';
import Postarea from './HomeComponents/Postarea';
import LoadingIndicator from './LoadingIndicator';
import { getChats, getPost } from '../helpers';
import LeftSidebar from './HomeComponents/LeftSidebar';
import { USER_CONNECTED, PRIVATE_MESSAGE } from '../helpers/socketTypes';
import ChatBox from './ChatComponents/ChatBox';
import { CREATE_MESSAGE, POST_LOADING } from '../helpers/actionTypes';
import '../styles/homepage.css';

/**
 * MAIN COMPONENT
 * - responsible for managing and displaying everthing on homepage
 */
const Homepage = (props) => {
  // selecting logged in user from redux store
  const user = useSelector(({ auth }) => auth.user);
  // selecting saved socket
  const socket = useSelector(({ auth }) => auth.socket);
  // using state to store online friends
  const [onlineFriends, setOnlineFriends] = useState([]);
  // using state to manage which chat is selected
  const [selectedChat, setSelectedChat] = useState(null);
  // using state to manage when to show chat box
  const [showChatBox, setShowChatBox] = useState(null);
  const dispatch = useDispatch();

  // on mount
  useEffect(() => {
    (() => {
      // if socket is available
      if (socket) {
        // if user is logged in
        if (user) {
          // get all posts
          dispatch({ type: POST_LOADING, payload: true });
          dispatch(getPost());
          // tell server that this user is online
          socket.emit(USER_CONNECTED, user);
          // recieve all online users from server
          socket.on('online_users', (onlineUsers) => {
            // filter the friends out
            user.friends.forEach((friend) => {
              if (onlineUsers.includes(friend._id)) {
                setOnlineFriends([...onlineFriends, friend]);
              }
            });
          });
          // recieve messages
          socket.on(PRIVATE_MESSAGE, (message) => {
            dispatch({ type: CREATE_MESSAGE, payload: message });
          });
          // test
          socket.on('testing', (data) => console.log(data));
        }
      }
      dispatch(getChats());
    })();
  }, []);

  // if user is not logged in redirect to auth page
  if (!user) return <Redirect to={{ pathname: '/auth' }} />;
  return (
    <div>
      <Navbar />
      <LoadingIndicator />
      <ChatBox
        selectedChat={selectedChat}
        showChatBox={showChatBox}
        setShowChatBox={setShowChatBox}
      />
      <div className="cover">
        <LeftSidebar />
        <Postarea />
        <Rightsidebar
          onlineFriends={onlineFriends}
          setSelectedChat={setSelectedChat}
          setShowChatBox={setShowChatBox}
        />
      </div>
    </div>
  );
};

export default Homepage;
