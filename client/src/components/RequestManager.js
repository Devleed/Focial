import React, { useState, useEffect } from 'react';
import { Dropdown, Loader } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import {
  acceptRequest,
  rejectRequest,
  checkRequest,
  requestSeen
} from '../helpers';

const RequestManager = () => {
  const requestsRecieved = useSelector(({ requests }) => requests.recieved);
  const loggedInUser = useSelector(({ auth }) => auth.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  let interval;

  useEffect(() => {
    (() => {
      // interval = setInterval(() => {
      dispatch(checkRequest());
      // }, 5000);
    })();
    // return () => clearInterval(interval);
  }, []);

  let unseen = requestsRecieved.filter(request => request.status === 0);

  const renderRequest = () => {
    return requestsRecieved.map(request => {
      return (
        <Dropdown.Item
          key={request._id}
          style={{ width: '100%', padding: '10px 0' }}
        >
          <img
            src={
              request.sender.profile_picture ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            }
            className="post_author-dp"
            style={{ borderRadius: '60%', width: '30px' }}
          />
          <NavLink
            to={`/user/${request.sender._id}`}
            className="request_sender"
          >
            {request.sender.name}
          </NavLink>
          {loggedInUser.friends.includes(request.sender._id) ? (
            <button className="request_button">Friends</button>
          ) : (
            <React.Fragment>
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch(acceptRequest(request._id, setLoading));
                }}
                className="request_button accept_request"
              >
                {loading ? <Loader active /> : 'Accept'}
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch(rejectRequest(request._id, setLoading));
                }}
                className="request_button reject_request"
              >
                {loading ? <Loader active /> : 'Reject'}
              </button>{' '}
            </React.Fragment>
          )}
        </Dropdown.Item>
      );
    });
  };
  return (
    <React.Fragment>
      <Dropdown
        icon="user"
        style={{ color: 'white' }}
        floating
        className="icon"
        onClick={() => dispatch(requestSeen())}
      >
        <Dropdown.Menu
          style={{
            width: '360px',
            paddingBottom: '10px',
            paddingRight: '5px'
          }}
          className="left"
        >
          <Dropdown.Header content="Friend Requests" />
          {renderRequest()}
        </Dropdown.Menu>
      </Dropdown>
      {unseen.length > 0 ? (
        <p className="request-number number">{unseen}</p>
      ) : null}
    </React.Fragment>
  );
};

export default RequestManager;
