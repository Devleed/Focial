import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';

import Navbar from './Navbar';
import Postarea from './HomeComponents/Postarea';
import Rightsidebar from './HomeComponents/Rightsidebar';
import Footer from './Footer';
import LoadingIndicator from './LoadingIndicator';
import RequestButtons from './RequestButtons';
import { checkRequest, getFriends } from '../helpers';
import '../styles/homepage.css';
import ProfileCards from './ProfileCards';

const Homepage = () => {
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);
  const user = useSelector(({ auth }) => auth.user);
  const [fixedClass, setFixedClass] = useState('');
  const dispatch = useDispatch();

  const handleScroll = e => {
    if (window.scrollY >= 230) setFixedClass('fixed-style');
    else {
      setFixedClass('');
    }
  };

  useEffect(() => {
    (() => {
      window.addEventListener('scroll', handleScroll);
    })();
    () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isLoggedIn) return <Redirect to={{ pathname: '/auth' }} />;
  return (
    <div>
      <Navbar />
      <LoadingIndicator />
      <Container style={{ marginTop: '60px' }}>
        <div className="cover">
          <ProfileCards
            owner={true}
            user={user}
            className="left_sidebar"
            style={fixedClass}
          >
            <div className="user_stats">
              <p>
                <span>Friends: </span>
                {user.friends.length}
              </p>
              <p>
                <span>Posts: </span>
                32
              </p>
            </div>
          </ProfileCards>
          <Postarea />
          <Rightsidebar />
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Homepage;
