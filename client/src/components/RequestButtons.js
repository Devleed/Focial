import React from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { Button } from 'semantic-ui-react';

import {
  sendRequest,
  checkRequest,
  deleteRequest,
  acceptRequest,
  rejectRequest,
  loadUser,
  unfriendUser,
  findUser
} from '../helpers';
import { SEND_REQUEST } from '../helpers/actionTypes';

const RequestButtons = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const user = useSelector(({ visitedUser }) => visitedUser);
  const loggedInUser = useSelector(({ auth }) => auth.user);
  const requests = useSelector(({ requests }) => requests);

  const requestsSent = requests.requestsSent.map(request => request.recieverID);
  const requestsRecieved = requests.requestsRecieved.map(
    request => request.senderID
  );

  const sendFriendRequest = (visitedUserID, loggedInUserID) => {
    sendRequest(visitedUserID, loggedInUserID).then(res => {
      dispatch({ type: SEND_REQUEST, payload: res });
    });
  };

  const cancelFriendRequest = (visitedUserID, loggedInUserID) => {
    deleteRequest(visitedUserID, loggedInUserID).then(res => {
      dispatch(checkRequest(store.getState().auth.token));
    });
  };

  const acceptFriendRequest = (visitedUserID, loggedInUserID) => {
    acceptRequest(visitedUserID, loggedInUserID).then(res => {
      dispatch(loadUser(store.getState().auth.token));
    });
  };

  const rejectFriendRequest = (visitedUserID, loggedInUserID) => {
    rejectRequest(visitedUserID, loggedInUserID).then(res => {
      dispatch(loadUser(store.getState().auth.token));
    });
  };

  const unfriend = (visitedUserID, loggedInUserID) => {
    unfriendUser(visitedUserID, loggedInUserID).then(res => {
      dispatch(loadUser(store.getState().auth.token));
      dispatch(findUser(visitedUserID));
    });
  };

  if (loggedInUser.friends.includes(user._id)) {
    return (
      <Button
        floated="right"
        onClick={() => unfriend(user._id, loggedInUser._id)}
      >
        {/* <Dropdown floating labeled button text="Friends">
              <Dropdown.Menu>
                <Dropdown.Item>Unfriend</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
        Unfriend
      </Button>
    );
  } else if (requestsSent.includes(user._id)) {
    return (
      <Button
        onClick={() => cancelFriendRequest(user._id, loggedInUser._id)}
        floated="right"
      >
        Cancel Request
      </Button>
    );
  } else if (requestsRecieved.includes(user._id)) {
    return (
      <React.Fragment>
        <Button
          negative
          onClick={() => rejectFriendRequest(user._id, loggedInUser._id)}
          floated="right"
        >
          Reject
        </Button>
        <Button
          primary
          onClick={() => acceptFriendRequest(user._id, loggedInUser._id)}
          floated="right"
        >
          Accept
        </Button>
      </React.Fragment>
    );
  } else {
    return (
      <Button
        floated="right"
        onClick={() => sendFriendRequest(user._id, loggedInUser._id)}
      >
        Send Request
      </Button>
    );
  }
};

export default RequestButtons;
