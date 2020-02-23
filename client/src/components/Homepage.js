import React from 'react';
import { Container } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Navbar from './Navbar';
import Leftsidebar from './HomeComponents/Leftsidebar';
import Postarea from './HomeComponents/Postarea';
import Rightsidebar from './HomeComponents/Rightsidebar';
import Footer from './Footer';
import '../styles/homepage.css';

const Homepage = () => {
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);

  if (!isLoggedIn) return <Redirect to={{ pathname: '/login' }} />;

  return (
    <div>
      <Navbar />
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
