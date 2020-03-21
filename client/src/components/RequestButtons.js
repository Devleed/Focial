import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';

import {
  sendRequest,
  deleteRequest,
  acceptRequest,
  rejectRequest,
  unfriendUser
} from '../helpers';

const RequestButtons = ({ user, float }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(({ auth }) => auth.user);
  const requests = useSelector(({ requests }) => requests);
  const [loading, setLoading] = useState(false);

  const requestsSent = requests.requestsSent.map(
    request => request.reciever._id
  );
  const requestsRecieved = requests.requestsRecieved.map(
    request => request.sender._id
  );

  let buttonFloatProp = {};
  if (float) buttonFloatProp.floated = float;

  if (loggedInUser)
    if (loggedInUser.friends.includes(user._id)) {
      return (
        <Button
          {...buttonFloatProp}
          onClick={() => {
            setLoading(true);
            dispatch(unfriendUser(user._id, loggedInUser._id, setLoading));
          }}
          negative
          loading={loading}
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
          {...buttonFloatProp}
          onClick={() => {
            setLoading(true);
            dispatch(deleteRequest(user._id, loggedInUser._id, setLoading));
          }}
          negative
          loading={loading}
        >
          Cancel Request
        </Button>
      );
    } else if (requestsRecieved.includes(user._id)) {
      return (
        <React.Fragment>
          <Button
            {...buttonFloatProp}
            negative
            onClick={() => {
              setLoading(true);
              dispatch(rejectRequest(user._id, loggedInUser._id, setLoading));
            }}
            loading={loading}
          >
            Reject
          </Button>
          <Button
            {...buttonFloatProp}
            primary
            onClick={() => {
              setLoading(true);
              dispatch(acceptRequest(user._id, loggedInUser._id, setLoading));
            }}
            loading={loading}
          >
            Accept
          </Button>
        </React.Fragment>
      );
    } else if (user._id === loggedInUser._id) {
      return null;
    } else {
      return (
        <Button
          {...buttonFloatProp}
          onClick={() => {
            setLoading(true);
            dispatch(sendRequest(user._id, loggedInUser._id, setLoading));
          }}
          loading={loading}
        >
          Send Request
        </Button>
      );
    }
  else return null;
};

export default RequestButtons;
