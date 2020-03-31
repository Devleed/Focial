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

  let selectedRequest;

  const checkStatus = id => {
    const sent = requests.sent.filter(request => request.reciever._id === id);
    const recieved = requests.recieved.filter(
      request => request.sender._id === id
    );
    if (sent.length > 0) {
      selectedRequest = sent[0];
      return { sent: 1 };
    }
    if (recieved.length > 0) {
      selectedRequest = recieved[0];
      return { recieved: 1 };
    }
    return {};
  };

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
    } else if (checkStatus(user._id).sent) {
      return (
        <Button
          {...buttonFloatProp}
          onClick={() => {
            setLoading(true);
            dispatch(deleteRequest(selectedRequest._id, setLoading));
          }}
          negative
          loading={loading}
        >
          Cancel Request
        </Button>
      );
    } else if (checkStatus(user._id).recieved) {
      return (
        <React.Fragment>
          <Button
            {...buttonFloatProp}
            negative
            onClick={() => {
              setLoading(true);
              dispatch(rejectRequest(selectedRequest._id, setLoading));
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
              dispatch(acceptRequest(selectedRequest._id, setLoading));
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
