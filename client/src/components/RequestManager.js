import React, { useState } from 'react';
import { Dropdown, Loader } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { acceptRequest, rejectRequest } from '../helpers';

const RequestManager = () => {
  const requestsRecieved = useSelector(
    ({ requests }) => requests.requestsRecieved
  );
  const loggedInUser = useSelector(({ auth }) => auth.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const renderRequest = () => {
    return requestsRecieved.map(request => {
      return (
        <Dropdown.Item key={request._id} style={{ width: '100%' }}>
          <NavLink to={`/user/${request.senderID}`} className="request_sender">
            {request.sender_name}
          </NavLink>
          {loggedInUser.friends.includes(request.senderID) ? (
            <button className="request_button">Friends</button>
          ) : (
            <React.Fragment>
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch(
                    acceptRequest(
                      request.senderID,
                      loggedInUser._id,
                      setLoading
                    )
                  );
                }}
                className="request_button accept_request"
              >
                {loading ? <Loader active /> : 'Accept'}
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch(
                    rejectRequest(
                      request.senderID,
                      loggedInUser._id,
                      setLoading
                    )
                  );
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
    <Dropdown.Menu>
      {requestsRecieved.length > 0 ? (
        <p className="number">{requestsRecieved.length}</p>
      ) : null}
      <Dropdown
        icon="user"
        style={{ color: 'white' }}
        floating
        className="icon"
      >
        <Dropdown.Menu
          style={{ width: '300px', paddingBottom: '10px', paddingRight: '5px' }}
          className="left"
        >
          <Dropdown.Header content="Friend Requests" />
          {renderRequest()}
        </Dropdown.Menu>
      </Dropdown>
    </Dropdown.Menu>
  );
};

export default RequestManager;
