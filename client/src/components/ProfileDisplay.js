import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { findUser } from '../helpers';
import { VISITED_USER } from '../helpers/actionTypes';
import { Container, Card, Image, Icon, Placeholder } from 'semantic-ui-react';
import RequestButtons from './RequestButtons';

const ProfileDisplay = props => {
  const dispatch = useDispatch();
  const user = useSelector(({ visitedUser }) => visitedUser);

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
        <React.Fragment>
          <Image
            src="https://homepages.cae.wisc.edu/~ece533/images/watch.png"
            alt="profile picture"
          />
          <Card.Content>
            <RequestButtons />
            <Card.Header>{user.name}</Card.Header>
            <Card.Meta>
              <span className="date">
                Joined in {user.register_date.split('-')[0]}
              </span>
            </Card.Meta>
            <Card.Description>lorem ipsum dolor sit amet</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon name="user" />
            {user.friends.length} friends
          </Card.Content>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
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
        </React.Fragment>
      );
    }
  };

  return (
    <Container style={{ marginTop: '60px' }}>
      <Card style={{ width: '70%', margin: '0 auto' }}>{displayContent()}</Card>
    </Container>
  );
};

export default ProfileDisplay;
