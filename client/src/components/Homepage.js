import React from 'react';
import { Container } from 'semantic-ui-react';

import Navbar from './Navbar';
import Leftsidebar from './HomeComponents/Leftsidebar';
import Postarea from './HomeComponents/Postarea';
import Rightsidebar from './HomeComponents/Rightsidebar';
import '../styles/homepage.css';
import Footer from './Footer';

const Homepage = () => {
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
