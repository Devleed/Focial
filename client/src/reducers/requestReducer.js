import {
  REQUEST_RECIEVED,
  REQUEST_SENT,
  SEND_REQUEST
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
    default:
      return state;
  }
};
