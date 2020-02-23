import {
  REQUEST_RECIEVED,
  REQUEST_SENT,
  SEND_REQUEST,
  REQUEST_ACCEPTED,
  REQUEST_REJECTED,
  CANCEL_REQUEST,
  RESET_REQUESTS
} from '../helpers/actionTypes';

const INITIAL_STATE = {
  requestsRecieved: [],
  requestsSent: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEND_REQUEST:
      return {
        ...state,
        requestsSent: [...state.requestsSent, action.payload]
      };
    case REQUEST_RECIEVED:
      return { ...state, requestsRecieved: action.payload };
    case REQUEST_SENT:
      return { ...state, requestsSent: action.payload };
    case REQUEST_ACCEPTED:
    case REQUEST_REJECTED:
      return {
        ...state,
        requestsRecieved: state.requestsRecieved.filter(
          request => request._id !== action.payload._id
        )
      };
    case CANCEL_REQUEST:
      return {
        ...state,
        requestsSent: state.requestsSent.filter(
          request => request._id !== action.payload._id
        )
      };
    case RESET_REQUESTS:
      return {
        requestsRecieved: [],
        requestsSent: []
      };
    default:
      return state;
  }
};
