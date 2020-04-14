import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Placeholder } from 'semantic-ui-react';

import { findUser } from '../helpers';
import { VISITED_USER } from '../helpers/actionTypes';
import RequestButtons from './RequestButtons';
import Navbar from './Navbar';
import '../styles/profileDisplay.css';
import Posts from './HomeComponents/Post Components/Posts';
import ProfilePictureUpdater from './ProfilePictureUpdater';
import { Redirect } from 'react-router-dom';

/**
 * MAIN COMPONENT
 * - responsible for displaying profile of user
 */
const ProfileDisplay = (props) => {
  const dispatch = useDispatch();
  // select the user which is visited
  const user = useSelector(({ visitedUser }) => visitedUser);
  // select if user is logged in
  const isLoggedIn = useSelector(({ auth }) => auth.isAuthorized);
  // select posts
  let posts = useSelector(({ postsData }) => postsData.posts);
  if (user) {
    // filter out the posts of visited user
    // sort them in descending order by date
    posts = posts
      .filter((post) => post.author._id === user._id)
      .sort(
        (a, b) =>
          new Date(b.date_shared ? b.date_shared : b.date_created) -
          new Date(a.date_shared ? a.date_shared : a.date_created)
      );
  }

  // on mount
  useEffect(() => {
    (() => {
      // find the user by taking id from url
      dispatch(findUser(props.match.params.id));
    })();
    // on unmount
    return () => {
      dispatch({ type: VISITED_USER, payload: null });
    };
  }, [dispatch, props.match.params.id]);

  // if not logged in redirect to auth page
  if (!isLoggedIn) {
    return <Redirect to={{ pathname: '/auth' }} />;
  }

  // funtion to display content
  const displayContent = () => {
    if (user) {
      return (
        <div className="profile_display">
          <img
            src="https://homepages.cae.wisc.edu/~ece533/images/watch.png"
            alt="cover photo"
            className="cover_photo"
          />
          <ProfilePictureUpdater user={user} />
          <div className="profile_content">
            <RequestButtons user={user} float="right" />
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
      // if no user is present show placeholder
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
