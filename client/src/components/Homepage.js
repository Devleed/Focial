import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Navbar from './Navbar';
import Leftsidebar from './HomeComponents/Leftsidebar';
import Postarea from './HomeComponents/Postarea';
import Rightsidebar from './HomeComponents/Rightsidebar';
import Footer from './Footer';
import LoadingIndicator from './LoadingIndicator';
import { checkRequest } from '../helpers';
import '../styles/homepage.css';

const Homepage = () => {
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);
  const dispatch = useDispatch();

  if (!isLoggedIn) return <Redirect to={{ pathname: '/login' }} />;

  // useEffect(() => {
  //   (() => {
  //     const requestChecker = setInterval(() => {
  //       dispatch(checkRequest());
  //     }, 10000);
  //     return () => {
  //       console.log('unmounted');
  //       clearInterval(requestChecker);
  //     };
  //   })();
  // }, []);

  return (
    <div>
      <Navbar />
      <LoadingIndicator />
      <Container style={{ marginTop: '60px' }}>
        <div className="cover">
          <Leftsidebar />
          <Postarea />
          <Rightsidebar />
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Homepage;
