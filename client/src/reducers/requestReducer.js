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
  recieved: [],
  sent: [],
  opened: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEND_REQUEST:
      return {
        ...state,
        sent: [...state.sent, action.payload]
      };
    case REQUEST_RECIEVED:
      return { ...state, recieved: action.payload };
    case REQUEST_SENT:
      return { ...state, sent: action.payload };
    case REQUEST_ACCEPTED:
    case REQUEST_REJECTED:
      return {
        ...state,
        recieved: state.recieved.filter(
          request => request._id !== action.payload._id
        )
      };
    case CANCEL_REQUEST:
      return {
        ...state,
        sent: state.sent.filter(request => request._id !== action.payload._id)
      };
    case RESET_REQUESTS:
      return {
        recieved: [],
        sent: []
      };
    default:
      return state;
  }
};
