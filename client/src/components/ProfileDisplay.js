import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Placeholder } from 'semantic-ui-react';

import { findUser } from '../helpers';
import { VISITED_USER } from '../helpers/actionTypes';
import RequestButtons from './RequestButtons';
import Navbar from './Navbar';
import '../styles/profileDisplay.css';
import Posts from './HomeComponents/Post Components/Posts';

const ProfileDisplay = props => {
  const dispatch = useDispatch();
  const user = useSelector(({ visitedUser }) => visitedUser);
  let posts = useSelector(({ postsData }) => postsData.posts);
  if (user) {
    posts = posts
      .filter(post => post.author === user._id)
      .sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
  }
  useEffect(() => {
    (() => {
      dispatch(findUser(props.match.params.id));
    })();
    return () => {
      dispatch({ type: VISITED_USER, payload: null });
    };
  }, [dispatch]);

  const displayContent = () => {
    if (user) {
      return (
        <div className="profile_display">
          <img
            src="https://homepages.cae.wisc.edu/~ece533/images/watch.png"
            alt="profile picture"
            className="cover_photo"
          />
          <div className="profile_content">
            <RequestButtons />
            <h1 style={{ textTransform: 'capitalize', margin: '0' }}>
              {user.name}
            </h1>
            <span className="date">
              Joined in {user.register_date.split('-')[0]}
            </span>
            <p>lorem ipsum dolor sit amet</p>
          </div>
          <div className="profile_user">
            <div className="user_content"></div>
            <Posts posts={posts} />
          </div>
        </div>
      );
    } else {
      return (
        <Placeholder>
          <Placeholder>
            <Placeholder.Image style={{ width: '100%' }} />
          </Placeholder>
          <br />
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="short" />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="medium" />
              <Placeholder.Line length="short" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Placeholder>
      );
    }
  };

  return (
    <div>
      <Navbar />
      <Container style={{ marginTop: '60px' }}>{displayContent()}</Container>
    </div>
  );
};

export default ProfileDisplay;
