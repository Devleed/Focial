import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Rightsidebar from './HomeComponents/Rightsidebar';
import Navbar from './Navbar';
import Postarea from './HomeComponents/Postarea';
import LoadingIndicator from './LoadingIndicator';
import { getChats } from '../helpers';
import '../styles/homepage.css';
import LeftSidebar from './HomeComponents/LeftSidebar';
import { USER_CONNECTED } from '../helpers/socketTypes';

const Homepage = (props) => {
  const user = useSelector(({ auth }) => auth.user);
  const socket = useSelector(({ auth }) => auth.socket);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    (() => {
      if (socket) {
        if (user) {
          socket.emit(USER_CONNECTED, user);
          socket.on('online_users', (onlineUsers) => {
            user.friends.forEach((friend) => {
              if (onlineUsers.includes(friend._id)) {
                setOnlineFriends([...onlineFriends, friend]);
              }
            });
          });
        }
      }
      dispatch(getChats());
    })();
  }, []);

  console.log('online-friends => ', onlineFriends);

  if (!user) return <Redirect to={{ pathname: '/auth' }} />;
  return (
    <div>
      <Navbar />
      <LoadingIndicator />

      <div className="cover">
        <LeftSidebar />
        <Postarea />
        <Rightsidebar onlineFriends={onlineFriends} />
      </div>
    </div>
  );
};

export default Homepage;
